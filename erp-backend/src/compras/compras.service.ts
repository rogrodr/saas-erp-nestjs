import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

  async criar(data: any, empresaId: number) {
    const compra = await this.prisma.compra.create({
      data: { ...data, empresaId },
      include: { itens: true },
    });

    for (const item of compra.itens) {
      await this.prisma.historicoPreco.create({
        data: {
          produtoId: item.produtoId,
          preco: item.preco,
          tipo: 'COMPRA',
          compraId: compra.id,
          empresaId,
        },
      });
    }

    return compra;
  }
}
