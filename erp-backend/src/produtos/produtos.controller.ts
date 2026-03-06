import { Controller, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt.guard'

@UseGuards(JwtAuthGuard)
@Controller('produtos')
export class ProdutosController {}
