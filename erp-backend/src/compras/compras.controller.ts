import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CriarCompraDto } from './dto/criar-compra.dto';

@Controller('compras')
export class ComprasController {
  constructor(private service: ComprasService) {}

  @Get()
  listar(@Req() req: any) {
    return this.service.listar(req.user.empresaId);
  }

  @Post()
  criar(@Body() data: CriarCompraDto, @Req() req: any) {
    return this.service.criar(data, req.user.empresaId);
  }
}
