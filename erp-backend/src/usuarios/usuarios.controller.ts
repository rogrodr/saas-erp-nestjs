import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.usuariosService.findAll(req.user.empresaId);
  }

  @Post()
  create(@Body() data: any, @Req() req: any) {
    return this.usuariosService.create(data, req.user.empresaId);
  }
}
