import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RelatoriosService {
  constructor(private prisma: PrismaService) {}

  async financeiro(empresaId: number, de?: string, ate?: string) {
    const hoje = new Date();

    // Período usado no DRE simplificado — padrão: mês atual, se não informado.
    const inicioPeriodo = de ? new Date(de) : new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimPeriodo = ate ? new Date(ate) : hoje;

    const daqui30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);

    
    const [receberVencidas, receberAVencer, receberEmAberto] = await Promise.all([
      this.prisma.contaReceber.findMany({
        where: { empresaId, pago: false, vencimento: { lt: hoje } },
        include: { cliente: true },
        orderBy: { vencimento: 'asc' },
      }),
      this.prisma.contaReceber.findMany({
        where: { empresaId, pago: false, vencimento: { gte: hoje, lte: daqui30Dias } },
        include: { cliente: true },
        orderBy: { vencimento: 'asc' },
      }),
      this.prisma.contaReceber.aggregate({
        where: { empresaId, pago: false },
        _sum: { valor: true },
      }),
    ]);

   
    const [pagarVencidas, pagarAVencer, pagarEmAberto] = await Promise.all([
      this.prisma.contaPagar.findMany({
        where: { empresaId, pago: false, vencimento: { lt: hoje } },
        orderBy: { vencimento: 'asc' },
      }),
      this.prisma.contaPagar.findMany({
        where: { empresaId, pago: false, vencimento: { gte: hoje, lte: daqui30Dias } },
        orderBy: { vencimento: 'asc' },
      }),
      this.prisma.contaPagar.aggregate({
        where: { empresaId, pago: false },
        _sum: { valor: true },
      }),
    ]);

    
    const [receitaVendas, despesasPagas] = await Promise.all([
      this.prisma.venda.aggregate({
        where: { empresaId, status: 'FATURADO', createdAt: { gte: inicioPeriodo, lte: fimPeriodo } },
        _sum: { total: true },
      }),
      this.prisma.contaPagar.aggregate({
        where: { empresaId, pago: true, vencimento: { gte: inicioPeriodo, lte: fimPeriodo } },
        _sum: { valor: true },
      }),
    ]);

    const receita = receitaVendas._sum.total ?? 0;
    const despesas = despesasPagas._sum.valor ?? 0;

    return {
      periodo: { de: inicioPeriodo, ate: fimPeriodo },
      contasReceber: {
        vencidas: receberVencidas,
        aVencer: receberAVencer,
        totalEmAberto: receberEmAberto._sum.valor ?? 0,
      },
      contasPagar: {
        vencidas: pagarVencidas,
        aVencer: pagarAVencer,
        totalEmAberto: pagarEmAberto._sum.valor ?? 0,
      },
      resultado: {
        receita,
        despesas,
        saldo: receita - despesas,
      },
    };
  }
}
