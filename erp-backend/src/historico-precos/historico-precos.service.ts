import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoricoPrecosService {
  constructor(private prisma: PrismaService) {}

  // ✅ filtra por empresaId para não vazar histórico entre tenants
  async historicoPorProduto(produtoId: number, empresaId: number) {
    return this.prisma.historicoPreco.findMany({
      where: { produtoId, empresaId },
      orderBy: { createdAt: 'asc' },
      include: {
        compra: { include: { fornecedor: true } },
        venda: true,
      },
    });
  }

  async menorPrecoPorPeriodo(empresaId: number, de: Date, ate: Date) {
    const historico = await this.prisma.historicoPreco.findMany({
      where: {
        empresaId,
        tipo: 'COMPRA',
        createdAt: { gte: de, lte: ate },
      },
      orderBy: { preco: 'asc' },
      include: {
        produto: true,
        compra: { include: { fornecedor: true } },
      },
    });

    const mapa = new Map<number, (typeof historico)[0]>();
    for (const h of historico) {
      if (!mapa.has(h.produtoId)) {
        mapa.set(h.produtoId, h);
      }
    }

    return Array.from(mapa.values()).map((h) => ({
      produto: h.produto.nome,
      menorPreco: h.preco,
      fornecedor: h.compra?.fornecedor?.nome ?? '—',
      data: h.createdAt,
    }));
  }
}
