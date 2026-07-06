import { Controller, Get, Post, Body, Req, Param } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CriarClienteDto } from './dto/criar-cliente.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  criar(@Body() data: CriarClienteDto, @Req() req: any) {
    return this.clientesService.criar(data, req.user.empresaId);
  }

  @Get()
  listar(@Req() req: any) {
    return this.clientesService.listar(req.user.empresaId);
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string, @Req() req: any) {
    return this.clientesService.buscarPorId(Number(id), req.user.empresaId);
  }
}