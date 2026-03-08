import { Controller, Get, Param, Query } from '@nestjs/common'
import { HistoricoPrecosService } from './historico-precos.service'

@Controller('historico-precos')
export class HistoricoPrecosController {

  constructor(private service: HistoricoPrecosService) {}

  // GET /historico-precos/produto/3
  @Get('produto/:produtoId')
  historicoPorProduto(@Param('produtoId') produtoId: string) {
    return this.service.historicoPorProduto(Number(produtoId))
  }

  // GET /historico-precos/menor-preco?empresaId=1&de=2026-01-01&ate=2026-03-08
  @Get('menor-preco')
  menorPreco(
    @Query('empresaId') empresaId: string,
    @Query('de') de: string,
    @Query('ate') ate: string,
  ) {
    return this.service.menorPrecoPorPeriodo(
      Number(empresaId),
      new Date(de),
      new Date(ate)
    )
  }

}