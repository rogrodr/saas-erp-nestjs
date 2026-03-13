import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FornecedoresService {
  constructor(private prisma: PrismaService) {}

  listar(empresaId: number) {
    return this.prisma.fornecedor.findMany({
      where: { empresaId },
    });
  }

  criar(data: any, empresaId: number) {
    return this.prisma.fornecedor.create({
      data: { ...data, empresaId },
    });
  }
}
