import { Module } from '@nestjs/common'
import { ComprasService } from './compras.service'
import { ComprasController } from './compras.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { XmlService } from './xml-import.service'

@Module({
  imports: [PrismaModule],
  controllers: [ComprasController],
  providers: [ComprasService, XmlService],
})
export class ComprasModule {}