import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ClientesService } from './clientes.service';

@Controller('clientes')
export class ClientesController {
  constructor(private clientesService: ClientesService) {}

  @Get()
  findAll(@Query('empresaId') empresaId: string) {
    return this.clientesService.findAll(Number(empresaId));
  }

  @Post()
  create(@Body() data: any) {
    return this.clientesService.create(data);
  }
}
