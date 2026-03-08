import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ContasPagarService {

  constructor(private prisma: PrismaService) {}

  listar() {
    return this.prisma.contaPagar.findMany()
  }

  criar(data: any) {
    return this.prisma.contaPagar.create({
      data
    })
  }

  pagar(id: number) {
    return this.prisma.contaPagar.update({
      where: { id },
      data: {
        pago: true
      }
    })
  }

}