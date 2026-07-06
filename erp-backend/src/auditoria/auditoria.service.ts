import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AcaoAuditoria } from '@prisma/client';
import { FiltroAuditoriaDto } from './dto/filtro-auditoria.dto';

@Injectable()
export class AuditoriaService {
  constructor(private readonly prisma: PrismaService) {}

  async registrar(
    empresaId: number,
    usuarioId: number,
    acao: AcaoAuditoria,
    entidade: string,
    entidadeId?: number,
    dadosAnteriores?: any,
    dadosNovos?: any,
  ) {
    return this.prisma.auditoria.create({
      data: {
        empresaId,
        usuarioId,
        acao,
        entidade,
        entidadeId,
        dadosAnteriores: dadosAnteriores ? JSON.stringify(dadosAnteriores) : null,
        dadosNovos: dadosNovos ? JSON.stringify(dadosNovos) : null,
      },
    });
  }

  listar(empresaId: number, filtros: FiltroAuditoriaDto) {
    const pagina = filtros.pagina || 1;
    const limite = filtros.limite || 20;
    const skip = (pagina - 1) * limite;

    return this.prisma.auditoria.findMany({
      where: {
        empresaId,
        ...(filtros.entidade && { entidade: filtros.entidade }),
        ...(filtros.acao && { acao: filtros.acao }),
      },
      include: {
        usuario: {
          select: { id: true, nome: true, email: true },
        },
      },
      skip,
      take: limite,
      orderBy: { createdAt: 'desc' },
    });
  }
}