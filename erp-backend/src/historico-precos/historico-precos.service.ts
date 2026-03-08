import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class HistoricoPrecosService {

  constructor(private prisma: PrismaService) {}

  // Lista todo o histórico de um produto com fornecedor e venda de origem
  async historicoPorProduto(produtoId: number) {
    return this.prisma.historicoPreco.findMany({
      where: { produtoId },
      orderBy: { createdAt: 'asc' },
      include: {
        compra: { include: { fornecedor: true } },
        venda:  true
      }
    })
  }

  // Retorna o menor preço de compra de cada produto num período,
  // mostrando qual fornecedor estava mais barato
  async menorPrecoPorPeriodo(empresaId: number, de: Date, ate: Date) {
    const historico = await this.prisma.historicoPreco.findMany({
      where: {
        empresaId,
        tipo: 'COMPRA',
        createdAt: { gte: de, lte: ate }
      },
      orderBy: { preco: 'asc' },
      include: {
        produto: true,
        compra:  { include: { fornecedor: true } }
      }
    })

    // Agrupa por produto mantendo apenas o menor preço
    const mapa = new Map<number, typeof historico[0]>()
    for (const h of historico) {
      if (!mapa.has(h.produtoId)) {
        mapa.set(h.produtoId, h) // já está ordenado por preco asc
      }
    }

    return Array.from(mapa.values()).map(h => ({
      produto:      h.produto.nome,
      menorPreco:   h.preco,
      fornecedor:   h.compra?.fornecedor?.nome ?? '—',
      data:         h.createdAt
    }))
  }

}