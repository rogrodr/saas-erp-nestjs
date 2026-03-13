import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { ContasReceberService } from './contas-receber.service';

@Controller('contas-receber')
export class ContasReceberController {
  constructor(private service: ContasReceberService) {}

  @Get()
  listar(@Req() req: any) {
    return this.service.listar(req.user.empresaId);
  }

  @Post()
  criar(@Body() data: any, @Req() req: any) {
    return this.service.criar(data, req.user.empresaId);
  }

  @Patch(':id/receber')
  receber(@Param('id') id: string, @Req() req: any) {
    return this.service.receber(Number(id), req.user.empresaId);
  }
}
