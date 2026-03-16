import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

const SELECT_SEGURO = {
  id: true,
  nome: true,
  email: true,
  role: true,
  createdAt: true,
};

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  findAll(empresaId: number, pagina = 1, limite = 20) {
    return this.prisma.usuario.findMany({
      where: { empresaId },
      skip: (pagina - 1) * limite,
      take: limite,
      select: SELECT_SEGURO,
    });
  }

  async create(
    data: { nome: string; email: string; senha: string; role?: string },
    empresaId: number,
  ) {
    const senhaHash = await bcrypt.hash(data.senha, 10);

    return this.prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: senhaHash,
        role: data.role ?? 'funcionario',
        empresaId,
      },
      select: SELECT_SEGURO,
    });
  }

  async atualizar(
    id: number,
    data: { nome?: string; email?: string; senha?: string; role?: string },
    empresaId: number,
  ) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { id, empresaId },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const senhaHash = data.senha
      ? await bcrypt.hash(data.senha, 10)
      : undefined;

    return this.prisma.usuario.update({
      where: { id },
      data: {
        nome: data.nome,
        email: data.email,
        role: data.role,
        ...(senhaHash && { senha: senhaHash }),
      },
      select: SELECT_SEGURO,
    });
  }

  async deletar(id: number, empresaId: number) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { id, empresaId },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    return this.prisma.usuario.delete({ where: { id } });
  }
}
