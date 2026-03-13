import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContasPagarService {
  constructor(private prisma: PrismaService) {}

  listar(empresaId: number) {
    return this.prisma.contaPagar.findMany({
      where: { empresaId },
    });
  }

  criar(data: any, empresaId: number) {
    return this.prisma.contaPagar.create({
      data: { ...data, empresaId },
    });
  }

  async pagar(id: number, empresaId: number) {
    // ✅ valida que a conta pertence ao tenant antes de atualizar
    const conta = await this.prisma.contaPagar.findFirst({
      where: { id, empresaId },
    });

    if (!conta) throw new NotFoundException('Conta não encontrada');

    return this.prisma.contaPagar.update({
      where: { id },
      data: { pago: true },
    });
  }
}
