import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarContaReceberDto } from './dto/criar-conta-receber.dto';

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

  async criar(data: CriarContaReceberDto, empresaId: number) {
    return this.prisma.contaReceber.create({
      data: {
        ...data,
        empresaId,
      },
    });
  }

  async receber(id: number, empresaId: number) {
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
