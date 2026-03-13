import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  findAll(empresaId: number) {
    return this.prisma.usuario.findMany({
      where: { empresaId },
      select: {
        id: true,
        nome: true,
        email: true,
        empresaId: true,
        // ✅ nunca retorna o hash da senha
      },
    });
  }

  create(data: any, empresaId: number) {
    return this.prisma.usuario.create({
      data: { ...data, empresaId },
    });
  }
}
