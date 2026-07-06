import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarFornecedorDto } from './dto/criar-fornecedor.dto';

@Injectable()
export class FornecedoresService {
  constructor(private prisma: PrismaService) {}

  listar(empresaId: number) {
    return this.prisma.fornecedor.findMany({
      where: { empresaId },
    });
  }

  async criar(data: CriarFornecedorDto, empresaId: number) {
    return this.prisma.fornecedor.create({
      data: {
        ...data,
        empresaId,
      },
    });
  }
}
