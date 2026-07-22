import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarCompraDto } from './dto/criar-compra.dto';
import { NotaFiscalImportada } from './xml-import.service';

@Injectable()
export class ComprasService {
  constructor(private prisma: PrismaService) {}

  listar(empresaId: number) {
    return this.prisma.compra.findMany({
      where: { empresaId },
      include: {
        fornecedor: true,
        itens: {
          include: { produto: true },
        },
      },
    });
  }

  // Cruza os dados extraídos do XML da NF-e com fornecedores/produtos já
  // cadastrados na empresa, pra o frontend mostrar uma tela de revisão antes
  // de efetivamente criar a compra (não cria nada ainda neste passo).
  async prepararImportacao(notaFiscal: NotaFiscalImportada, empresaId: number) {
    const cnpjLimpo = notaFiscal.fornecedor.cnpj.replace(/\D/g, '');

    const fornecedores = await this.prisma.fornecedor.findMany({ where: { empresaId } });
    const fornecedorEncontrado = fornecedores.find(
      (fornecedor) => fornecedor.cnpj && fornecedor.cnpj.replace(/\D/g, '') === cnpjLimpo,
    );

    const codigos = notaFiscal.itens.map((item) => item.codigo);
    const produtos = await this.prisma.produto.findMany({
      where: { empresaId, sku: { in: codigos } },
    });
    const produtoPorSku = new Map(produtos.map((produto) => [produto.sku, produto]));

    return {
      fornecedor: {
        cnpj: notaFiscal.fornecedor.cnpj,
        nome: notaFiscal.fornecedor.nome,
        fornecedorIdSugerido: fornecedorEncontrado?.id ?? null,
      },
      itens: notaFiscal.itens.map((item) => {
        const produto = produtoPorSku.get(item.codigo);
        return {
          codigo: item.codigo,
          descricao: item.descricao,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
          produtoIdSugerido: produto?.id ?? null,
          produtoNomeSugerido: produto?.nome ?? null,
        };
      }),
      valorTotal: notaFiscal.valorTotal,
    };
  }

  async criar(data: CriarCompraDto, empresaId: number) {
    const produtoIds = data.itens.map((item) => item.produtoId);
    const produtos = await this.prisma.produto.findMany({
      where: { id: { in: produtoIds }, empresaId },
    });

    if (produtos.length !== produtoIds.length) {
      throw new NotFoundException('Um ou mais produtos não foram encontrados');
    }

    const produtoMap = new Map(produtos.map((produto) => [produto.id, produto]));

    return this.prisma.$transaction(async (tx) => {
      const compra = await tx.compra.create({
        data: {
          fornecedorId: data.fornecedorId,
          total: data.total,
          empresaId,
          itens: {
            create: data.itens.map((item) => ({
              produtoId: item.produtoId,
              quantidade: item.quantidade,
              preco: item.preco,
            })),
          },
        },
        include: { itens: true },
      });

      for (const item of compra.itens) {
        const produto = produtoMap.get(item.produtoId);
        if (!produto) {
          throw new NotFoundException(`Produto ${item.produtoId} não encontrado`);
        }

        await tx.historicoPreco.create({
          data: {
            produtoId: item.produtoId,
            preco: item.preco,
            tipo: 'COMPRA',
            compraId: compra.id,
            empresaId,
          },
        });

        await tx.produto.update({
          where: { id: item.produtoId },
          data: { estoque: { increment: item.quantidade } },
        });
      }

      return compra;
    });
  }
}
