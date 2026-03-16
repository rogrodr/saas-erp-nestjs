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
import { ProdutosService } from './produtos.service';
import { Roles, Role } from '../common/roles.decorator';

@Controller('produtos')
export class ProdutosController {
  constructor(private service: ProdutosService) {}

  @Get()
  listar(
    @Req() req: any,
    @Query('pagina') pagina: string,
    @Query('limite') limite: string,
  ) {
    return this.service.listar(
      req.user.empresaId,
      Number(pagina) || 1,
      Number(limite) || 20,
    );
  }

  @Post()
  @Roles(Role.Admin)
  criar(@Body() data: any, @Req() req: any) {
    return this.service.criar(data, req.user.empresaId);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  atualizar(@Param('id') id: string, @Body() data: any, @Req() req: any) {
    return this.service.atualizar(Number(id), data, req.user.empresaId);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  deletar(@Param('id') id: string, @Req() req: any) {
    return this.service.deletar(Number(id), req.user.empresaId);
  }
}
