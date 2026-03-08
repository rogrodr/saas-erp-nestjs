import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common'
import { ContasReceberService } from './contas-receber.service'

@Controller('contas-receber')
export class ContasReceberController {

  constructor(private service: ContasReceberService) {}

  @Get()
  listar() {
    return this.service.listar()
  }

  @Post()
  criar(@Body() data: any) {
    return this.service.criar(data)
  }

  @Patch(':id/receber')
  receber(@Param('id') id: string) {
    return this.service.receber(Number(id))
  }

}