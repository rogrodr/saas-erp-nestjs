import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async obterResumo(empresaId: number) {
    const dataAtual = new Date();
    const inicioDoMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);

    const vendasDoMes = await this.prisma.venda.aggregate({
      where: {
        empresaId,
        createdAt: { gte: inicioDoMes },
      },
      _sum: { total: true },
    });

    const itensMaisVendidos = await this.prisma.itemVenda.groupBy({
      by: ['produtoId'],
      where: {
        venda: {
          empresaId,
        },
      },
      _sum: {
        quantidade: true,
      },
      orderBy: {
        _sum: {
          quantidade: 'desc',
        },
      },
      take: 5,
    });

    const detalhesProdutos = await this.prisma.produto.findMany({
      where: {
        id: { in: itensMaisVendidos.map((item) => item.produtoId) },
      },
      select: { id: true, nome: true },
    });

    const produtosMaisVendidos = itensMaisVendidos.map((item) => ({
      produtoId: item.produtoId,
      nome: detalhesProdutos.find((p) => p.id === item.produtoId)?.nome,
      quantidadeVendida: item._sum.quantidade,
    }));

    const alertasEstoque = await this.prisma.produto.findMany({
      where: {
        empresaId,
      },
      orderBy: {
        estoque: 'asc',
      },
      take: 10,
    });

    const recebiveisAtrasados = await this.prisma.contaReceber.aggregate({
      where: {
        empresaId,
        pago: false,
        vencimento: { lt: dataAtual },
      },
      _sum: { valor: true },
    });

    return {
      faturamentoMensal: vendasDoMes._sum.total || 0,
      produtosMaisVendidos,
      alertasEstoque,
      valorEmAtraso: recebiveisAtrasados._sum.valor || 0,
    };
  }
}