import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarClienteDto } from './dto/criar-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async criar(data: CriarClienteDto, empresaId: number) {
    const { enderecos, contatos, ...clienteData } = data;

    return this.prisma.cliente.create({
      data: {
        ...clienteData,
        empresaId,
        enderecos: enderecos ? { create: enderecos } : undefined,
        contatos: contatos ? { create: contatos } : undefined,
      },
      include: {
        enderecos: true,
        contatos: true,
      },
    });
  }

  listar(empresaId: number) {
    return this.prisma.cliente.findMany({
      where: { empresaId },
      include: {
        enderecos: true,
        contatos: true,
      },
    });
  }

  async buscarPorId(id: number, empresaId: number) {
    const cliente = await this.prisma.cliente.findFirst({
      where: { id, empresaId },
      include: {
        enderecos: true,
        contatos: true,
        vendas: true,
      },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return cliente;
  }
}