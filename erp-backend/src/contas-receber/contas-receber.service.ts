import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ContasReceberService {

  constructor(private prisma: PrismaService) {}

  listar() {
    return this.prisma.contaReceber.findMany({
      include: {
        cliente: true,
        venda:   true
      }
    })
  }

  criar(data: any) {
    return this.prisma.contaReceber.create({ data })
  }

  receber(id: number) {
    return this.prisma.contaReceber.update({
      where: { id },
      data: { pago: true } // ✅ era recebido
    })
  }

}