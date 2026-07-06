import { Controller, Get, Post, Body, Req, Param } from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { CriarMovimentacaoDto } from './dto/criar-movimentacao.dto';

@Controller('estoque')
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  @Get()
  listar(@Req() req: any) {
    return this.estoqueService.listarMovimentacoes(req.user.empresaId);
  }

  @Post()
  registrar(@Body() data: CriarMovimentacaoDto, @Req() req: any) {
    return this.estoqueService.registrarMovimentacao(
      req.user.empresaId,
      req.user.usuarioId,
      data,
    );
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string, @Req() req: any) {
    return this.estoqueService.buscarPorId(Number(id), req.user.empresaId);
  }
}
