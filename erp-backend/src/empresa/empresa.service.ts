import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmpresaService {
  constructor(private prisma: PrismaService) {}

  async minha(empresaId: number) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
    });
    if (!empresa) throw new NotFoundException('Empresa não encontrada');
    return empresa;
  }

  async atualizar(empresaId: number, data: any) {
    await this.minha(empresaId);
    return this.prisma.empresa.update({
      where: { id: empresaId },
      data: { nome: data.nome, cnpj: data.cnpj },
    });
  }
}
