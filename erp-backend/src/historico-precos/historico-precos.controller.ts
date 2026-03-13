import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { HistoricoPrecosService } from './historico-precos.service';

@Controller('historico-precos')
export class HistoricoPrecosController {
  constructor(private service: HistoricoPrecosService) {}

  @Get('produto/:produtoId')
  historicoPorProduto(@Param('produtoId') produtoId: string, @Req() req: any) {
    return this.service.historicoPorProduto(
      Number(produtoId),
      req.user.empresaId,
    );
  }

  @Get('menor-preco')
  menorPreco(
    @Query('de') de: string,
    @Query('ate') ate: string,
    @Req() req: any,
  ) {
    return this.service.menorPrecoPorPeriodo(
      req.user.empresaId,
      new Date(de),
      new Date(ate),
    );
  }
}
