import { Controller, Get, Post, Body } from '@nestjs/common'
import { FornecedoresService } from './fornecedores.service'

@Controller('fornecedores')
export class FornecedoresController {

  constructor(private service: FornecedoresService) {}

  @Get()
  listar() {
    return this.service.listar()
  }

  @Post()
  criar(@Body() data: any) {
    return this.service.criar(data)
  }

}