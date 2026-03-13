import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Get()
  findAll(@Query('empresaId') empresaId: string) {
    return this.usuariosService.findAll(Number(empresaId));
  }

  @Post()
  create(@Body() data: any) {
    return this.usuariosService.create(data);
  }
}
