import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Roles, Role } from '../common/roles.decorator';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Get()
  @Roles(Role.Admin)
  findAll(
    @Req() req: any,
    @Query('pagina') pagina: string,
    @Query('limite') limite: string,
  ) {
    return this.usuariosService.findAll(
      req.user.empresaId,
      Number(pagina) || 1,
      Number(limite) || 20,
    );
  }

  @Post()
  @Roles(Role.Admin)
  create(@Body() data: CriarUsuarioDto, @Req() req: any) {
    return this.usuariosService.create(data, req.user.empresaId);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  atualizar(
    @Param('id') id: string,
    @Body() data: AtualizarUsuarioDto,
    @Req() req: any,
  ) {
    return this.usuariosService.atualizar(Number(id), data, req.user.empresaId);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  deletar(@Param('id') id: string, @Req() req: any) {
    return this.usuariosService.deletar(Number(id), req.user.empresaId);
  }
}