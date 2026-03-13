import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ClientesService } from './clientes.service';

@Controller('clientes')
export class ClientesController {
  constructor(private clientesService: ClientesService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.clientesService.findAll(req.user.empresaId);
  }

  @Post()
  create(@Body() data: any, @Req() req: any) {
    return this.clientesService.create(data, req.user.empresaId);
  }
}
