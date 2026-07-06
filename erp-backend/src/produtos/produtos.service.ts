import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginar } from '../common/paginacao.dto';
import { CriarProdutoDto } from './dto/criar-produto.dto';

@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) {}

  listar(empresaId: number, pagina = 1, limite = 20) {
    return this.prisma.produto.findMany({
      where: { empresaId },
      ...paginar(pagina, limite),
      orderBy: { nome: 'asc' },
    });
  }

  criar(data: any, empresaId: number) {
    return this.prisma.produto.create({
      data: { ...data, empresaId },
    });
  }

  async atualizar(id: number, data: any, empresaId: number) {
    await this.verificarTenant(id, empresaId);
    return this.prisma.produto.update({ where: { id }, data });
  }

  async deletar(id: number, empresaId: number) {
    await this.verificarTenant(id, empresaId);
    return this.prisma.produto.delete({ where: { id } });
  }

  private async verificarTenant(id: number, empresaId: number) {
    const produto = await this.prisma.produto.findFirst({
      where: { id, empresaId },
    });
    if (!produto) throw new NotFoundException('Produto não encontrado');
  }

  async criar(data: CriarProdutoDto, empresaId: number) {
    return this.prisma.produto.create({
      data: {
        ...data,
        empresaId,
      },
    });
  }
}
