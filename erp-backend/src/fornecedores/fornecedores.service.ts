import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class FornecedoresService {

  constructor(private prisma: PrismaService) {}

  listar() {
    return this.prisma.fornecedor.findMany()
  }

  criar(data: any) {
    return this.prisma.fornecedor.create({
      data
    })
  }

}