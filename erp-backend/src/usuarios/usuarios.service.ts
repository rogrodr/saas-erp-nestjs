import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  findAll(empresaId: number) {
    return this.prisma.usuario.findMany({
      where: { empresaId },
    });
  }

  create(data: any) {
    return this.prisma.usuario.create({
      data,
    });
  }
}
