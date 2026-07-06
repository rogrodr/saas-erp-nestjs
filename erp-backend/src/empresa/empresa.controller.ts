import { Controller, Get, Patch, Body, Req } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { Roles, Role } from '../common/roles.decorator';
import { AtualizarEmpresaDto } from './dto/atualizar-empresa.dto';

@Controller('empresa')
export class EmpresaController {
  constructor(private service: EmpresaService) {}

  @Get('minha')
  minha(@Req() req: any) {
    return this.service.minha(req.user.empresaId);
  }

  @Patch('minha')
  @Roles(Role.Admin)
  atualizar(@Body() data: AtualizarEmpresaDto, @Req() req: any) {
    return this.service.atualizar(req.user.empresaId, data);
  }
}
