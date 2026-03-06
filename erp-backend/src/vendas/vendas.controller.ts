import { Controller, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('vendas')
export class VendasController {}
