import { Module } from '@nestjs/common'
import { ContasReceberController } from './contas-receber.controller'
import { ContasReceberService } from './contas-receber.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [ContasReceberController],
  providers: [ContasReceberService],
})
export class ContasReceberModule {}