import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendasService {
  constructor(private prisma: PrismaService) {}

  listar(empresaId: number) {
    return this.prisma.venda.findMany({
      where: { empresaId },
      include: {
        cliente: true,
        itens: {
          include: { produto: true },
        },
      },
    });
  }


  async criar(data: CriarVendaDto, empresaId: number) {
    const { itens, ...vendaData } = data;

    const venda = await this.prisma.venda.create({
      data: {
        ...vendaData,
        empresaId,
        itens: {
          create: itens.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            preco: item.preco,
          })),
        },
      },
      include: { itens: true },
    });

    for (const item of venda.itens) {
      await this.prisma.historicoPreco.create({
        data: {
          produtoId: item.produtoId,
          preco: item.preco,
          tipo: 'VENDA',
          vendaId: venda.id,
          empresaId,
        },
      });

      await this.prisma.produto.update({
        where: { id: item.produtoId },
        data: { estoque: { decrement: item.quantidade } },
      });
    }

    if (vendaData.status === 'FATURADO') {
      await this.prisma.contaReceber.create({
        data: {
          descricao: `Venda #${venda.id}`,
          valor: venda.total - (vendaData.desconto || 0),
          vencimento: new Date(),
          vendaId: venda.id,
          clienteId: vendaData.clienteId,
          empresaId,
        },
      });
    }

    return venda;
  }

  async atualizar(id: number, data: CriarVendaDto, empresaId: number) {
    await this.verificarTenant(id, empresaId);
    const { itens, ...vendaData } = data;
    return this.prisma.venda.update({
      where: { id },
      data: { ...vendaData, empresaId },
      include: { itens: true },
    });
  }

  private async verificarTenant(id: number, empresaId: number) {
    const venda = await this.prisma.venda.findFirst({
      where: { id, empresaId },
    });
    if (!venda) throw new NotFoundException('Venda não encontrada');
  }
}
