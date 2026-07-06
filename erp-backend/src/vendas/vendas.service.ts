import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarVendaDto } from './dto/criar-venda.dto';

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

    const produtoIds = itens.map((item) => item.produtoId);
    const produtos = await this.prisma.produto.findMany({
      where: { id: { in: produtoIds }, empresaId },
    });

    if (produtos.length !== produtoIds.length) {
      throw new NotFoundException('Um ou mais produtos não foram encontrados');
    }

    const produtoMap = new Map(produtos.map((produto) => [produto.id, produto]));

    for (const item of itens) {
      const produto = produtoMap.get(item.produtoId);
      if (!produto) {
        throw new NotFoundException(`Produto ${item.produtoId} não encontrado`);
      }
      if (produto.estoque < item.quantidade) {
        throw new BadRequestException(`Estoque insuficiente para o produto ${produto.nome}`);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const venda = await tx.venda.create({
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
        await tx.historicoPreco.create({
          data: {
            produtoId: item.produtoId,
            preco: item.preco,
            tipo: 'VENDA',
            vendaId: venda.id,
            empresaId,
          },
        });

        await tx.produto.update({
          where: { id: item.produtoId },
          data: { estoque: { decrement: item.quantidade } },
        });
      }

      if (venda.status === 'FATURADO') {
        await tx.contaReceber.create({
          data: {
            descricao: `Venda #${venda.id}`,
            valor: venda.total - (venda.desconto || 0),
            vencimento: new Date(),
            vendaId: venda.id,
            clienteId: venda.clienteId,
            empresaId,
          },
        });
      }

      return venda;
    });
  }

  async atualizar(id: number, data: Partial<CriarVendaDto>, empresaId: number) {
    await this.verificarTenant(id, empresaId);
    const { itens, ...vendaData } = data;

    if (itens && itens.length > 0) {
      throw new BadRequestException('Atualização de itens não é suportada');
    }

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
