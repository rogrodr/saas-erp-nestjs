import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarMovimentacaoDto } from './dto/criar-movimentacao.dto';

@Injectable()
export class EstoqueService {
  constructor(private prisma: PrismaService) {}

  listarMovimentacoes(empresaId: number) {
    return this.prisma.movimentacaoEstoque.findMany({
      where: { empresaId },
      include: { produto: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async registrarMovimentacao(empresaId: number, usuarioId: number, data: CriarMovimentacaoDto) {
    const produto = await this.prisma.produto.findFirst({
      where: { id: data.produtoId, empresaId },
    });

    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (data.tipo === 'SAIDA' && produto.estoque < data.quantidade) {
      throw new BadRequestException('Estoque insuficiente');
    }

    return this.prisma.$transaction(async (tx) => {
      const movimentacao = await tx.movimentacaoEstoque.create({
        data: {
          ...data,
          empresaId,
          usuarioId,
        },
      });

      let novoEstoque = produto.estoque;
      
      if (data.tipo === 'ENTRADA') novoEstoque += data.quantidade;
      if (data.tipo === 'SAIDA') novoEstoque -= data.quantidade;
      if (data.tipo === 'AJUSTE') novoEstoque = data.quantidade;

      await tx.produto.update({
        where: { id: produto.id },
        data: { estoque: novoEstoque },
      });

      return movimentacao;
    });
  }

  async buscarPorId(id: number, empresaId: number) {
    const movimentacao = await this.prisma.movimentacaoEstoque.findFirst({
      where: { id, empresaId },
      include: { produto: true },
    });

    if (!movimentacao) {
      throw new NotFoundException('Movimentação não encontrada');
    }

    return movimentacao;
  }
}