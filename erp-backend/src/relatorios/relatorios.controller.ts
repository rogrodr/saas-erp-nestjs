import { Controller, Get, Query, Req } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';

@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('financeiro')
  financeiro(@Query('de') de: string | undefined, @Query('ate') ate: string | undefined, @Req() req: any) {
    return this.relatoriosService.financeiro(req.user.empresaId, de, ate);
  }
}
