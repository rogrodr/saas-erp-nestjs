import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { FiltroAuditoriaDto } from './dto/filtro-auditoria.dto';
import { Roles, Role } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@Controller('auditoria')
@UseGuards(RolesGuard)
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get()
  @Roles(Role.ADMIN)
  listar(@Query() filtros: FiltroAuditoriaDto, @Req() req: any) {
    return this.auditoriaService.listar(req.user.empresaId, filtros);
  }
}