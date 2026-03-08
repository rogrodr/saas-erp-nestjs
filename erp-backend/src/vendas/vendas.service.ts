import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class VendasService {

  constructor(private prisma: PrismaService) {}

  listar() {
    return this.prisma.venda.findMany({
      include: {
        cliente: true,
        itens: {
          include: { produto: true }
        }
      }
    })
  }

  async criar(data: any) {
    const venda = await this.prisma.venda.create({
      data,
      include: { itens: true }
    })

    // Salva histórico de preço com referência à venda (para comparação futura)
    for (const item of venda.itens) {
      await this.prisma.historicoPreco.create({
        data: {
          produtoId:  item.produtoId,
          preco:      item.preco,
          tipo:       'VENDA',
          vendaId:    venda.id,    // ✅ rastreia a origem
          empresaId:  venda.empresaId
        }
      })
    }

    // Gera conta a receber vinculada ao cliente e à venda
    await this.prisma.contaReceber.create({
      data: {
        descricao:  `Venda #${venda.id}`,
        valor:      venda.total,
        vencimento: new Date(),
        empresaId:  venda.empresaId,
        clienteId:  venda.clienteId ?? null,  // ✅ vínculo com cliente
        vendaId:    venda.id                  // ✅ vínculo com venda
      }
    })

    return venda
  }

}