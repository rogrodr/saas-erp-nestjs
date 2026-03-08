import { Controller, Get, Post, Body } from '@nestjs/common'
import { ComprasService } from './compras.service'

@Controller('compras')
export class ComprasController {

  constructor(private service: ComprasService) {}

  @Get()
  listar() {
    return this.service.listar()
  }

  @Post()
  criar(@Body() data: any) {
    return this.service.criar(data)
  }

}