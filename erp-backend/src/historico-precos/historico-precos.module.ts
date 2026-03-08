import { Module } from '@nestjs/common'
import { HistoricoPrecosService } from './historico-precos.service'
import { HistoricoPrecosController } from './historico-precos.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [HistoricoPrecosService],
  controllers: [HistoricoPrecosController],
})
export class HistoricoPrecosModule {}