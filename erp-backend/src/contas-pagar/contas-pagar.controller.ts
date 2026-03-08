import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common'
import { ContasPagarService } from './contas-pagar.service'

@Controller('contas-pagar')
export class ContasPagarController {

  constructor(private service: ContasPagarService) {}

  @Get()
  listar() {
    return this.service.listar()
  }

  @Post()
  criar(@Body() data: any) {
    return this.service.criar(data)
  }

  @Patch(':id/pagar')
  pagar(@Param('id') id: string) {
    return this.service.pagar(Number(id))
  }

}