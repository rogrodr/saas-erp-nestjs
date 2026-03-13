import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { VendasService } from './vendas.service';

@Controller('vendas')
export class VendasController {
  constructor(private vendasService: VendasService) {}

  @Get()
  listar(@Req() req: any) {
    return this.vendasService.listar(req.user.empresaId);
  }

  @Post()
  criar(@Body() data: any, @Req() req: any) {
    return this.vendasService.criar(data, req.user.empresaId);
  }
}
