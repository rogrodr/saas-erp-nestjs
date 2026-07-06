import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarContaPagarDto } from './dto/criar-conta-pagar.dto';

@Injectable()
export class ContasPagarService {
  constructor(private prisma: PrismaService) {}

  listar(empresaId: number) {
    return this.prisma.contaPagar.findMany({
      where: { empresaId },
    });
  }

  async criar(data: CriarContaPagarDto, empresaId: number) {
    return this.prisma.contaPagar.create({
      data: {
        ...data,
        empresaId,
      },
    });
  }

  async pagar(id: number, empresaId: number) {
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
