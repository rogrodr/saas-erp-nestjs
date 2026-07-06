import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContasReceberService {
  constructor(private prisma: PrismaService) {}

  listar(empresaId: number) {
    return this.prisma.contaReceber.findMany({
      where: { empresaId },
      include: {
        cliente: true,
        venda: true,
      },
    });
  }

  async receber(id: number, empresaId: number) {
    // ✅ valida que a conta pertence ao tenant antes de atualizar
    const conta = await this.prisma.contaReceber.findFirst({
      where: { id, empresaId },
    });

    if (!conta) throw new NotFoundException('Conta não encontrada');

    return this.prisma.contaReceber.update({
      where: { id },
      data: { pago: true },
    });
  }
}
