import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt.guard'
import { VendasService } from './vendas.service'

@UseGuards(JwtAuthGuard)
@Controller('vendas')
export class VendasController {

  constructor(private vendasService: VendasService) {}

  @Get()
  listar() {
    return this.vendasService.listar()
  }

  @Post()
  criar(@Body() data: any) {
    return this.vendasService.criar(data)
  }

}