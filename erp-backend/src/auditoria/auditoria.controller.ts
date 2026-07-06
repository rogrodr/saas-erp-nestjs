import { Controller, Get, Query, Req } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { FiltroAuditoriaDto } from './dto/filtro-auditoria.dto';
import { Roles, Role } from '../common/roles.decorator';

@Controller('auditoria')
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get()
  @Roles(Role.Admin)
  listar(@Query() filtros: FiltroAuditoriaDto, @Req() req: any) {
    return this.auditoriaService.listar(req.user.empresaId, filtros);
  }
}