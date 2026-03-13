import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ComprasService } from './compras.service';

@Controller('compras')
export class ComprasController {
  constructor(private service: ComprasService) {}

  @Get()
  listar(@Req() req: any) {
    return this.service.listar(req.user.empresaId);
  }

  @Post()
  criar(@Body() data: any, @Req() req: any) {
    return this.service.criar(data, req.user.empresaId);
  }
}
