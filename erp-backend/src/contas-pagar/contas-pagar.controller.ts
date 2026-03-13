import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { ContasPagarService } from './contas-pagar.service';

@Controller('contas-pagar')
export class ContasPagarController {
  constructor(private service: ContasPagarService) {}

  @Get()
  listar(@Req() req: any) {
    return this.service.listar(req.user.empresaId);
  }

  @Post()
  criar(@Body() data: any, @Req() req: any) {
    return this.service.criar(data, req.user.empresaId);
  }

  @Patch(':id/pagar')
  pagar(@Param('id') id: string, @Req() req: any) {
    return this.service.pagar(Number(id), req.user.empresaId);
  }
}
