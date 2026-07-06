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

}
