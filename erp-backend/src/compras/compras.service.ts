import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarCompraDto } from './dto/criar-compra.dto';

@Injectable()
export class ComprasService {
  constructor(private prisma: PrismaService) {}

  listar(empresaId: number) {
    return this.prisma.compra.findMany({
      where: { empresaId },
      include: {
        fornecedor: true,
        itens: {
          include: { produto: true },
        },
      },
    });
  }

  async criar(data: CriarCompraDto, empresaId: number) {
    const produtoIds = data.itens.map((item) => item.produtoId);
    const produtos = await this.prisma.produto.findMany({
      where: { id: { in: produtoIds }, empresaId },
    });

    if (produtos.length !== produtoIds.length) {
      throw new NotFoundException('Um ou mais produtos não foram encontrados');
    }

    const produtoMap = new Map(produtos.map((produto) => [produto.id, produto]));

    return this.prisma.$transaction(async (tx) => {
      const compra = await tx.compra.create({
        data: {
          fornecedorId: data.fornecedorId,
          total: data.total,
          empresaId,
          itens: {
            create: data.itens.map((item) => ({
              produtoId: item.produtoId,
              quantidade: item.quantidade,
              preco: item.preco,
            })),
          },
        },
        include: { itens: true },
      });

      for (const item of compra.itens) {
        const produto = produtoMap.get(item.produtoId);
        if (!produto) {
          throw new NotFoundException(`Produto ${item.produtoId} não encontrado`);
        }

        await tx.historicoPreco.create({
          data: {
            produtoId: item.produtoId,
            preco: item.preco,
            tipo: 'COMPRA',
            compraId: compra.id,
            empresaId,
          },
        });

        await tx.produto.update({
          where: { id: item.produtoId },
          data: { estoque: { increment: item.quantidade } },
        });
      }

      return compra;
    });
  }
}
