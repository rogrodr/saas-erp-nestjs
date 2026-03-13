import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  findAll(empresaId: number) {
    return this.prisma.cliente.findMany({
      where: { empresaId },
    });
  }

  create(data: any) {
    return this.prisma.cliente.create({
      data,
    });
  }
}
