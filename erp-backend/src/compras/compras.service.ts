import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ComprasService {

  constructor(private prisma: PrismaService) {}

  listar() {
    return this.prisma.compra.findMany({
      include: {
        fornecedor: true,
        itens: {
          include: { produto: true }
        }
      }
    })
  }

  async criar(data: any) {
    const compra = await this.prisma.compra.create({
      data,
      include: { itens: true }
    })

    // Salva histórico de preço com referência à compra (para comparação futura)
    for (const item of compra.itens) {
      await this.prisma.historicoPreco.create({
        data: {
          produtoId:  item.produtoId,
          preco:      item.preco,
          tipo:       'COMPRA',
          compraId:   compra.id,   // ✅ rastreia a origem
          empresaId:  compra.empresaId
        }
      })
    }

    return compra
  }

}