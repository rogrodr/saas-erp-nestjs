import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { EmpresaModule } from './empresa/empresa.module'
import { UsuariosModule } from './usuarios/usuarios.module'
import { ClientesModule } from './clientes/clientes.module'
import { ProdutosModule } from './produtos/produtos.module'
import { VendasModule } from './vendas/vendas.module'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth/jwt.guard'

@Module({
  imports: [
    PrismaModule,
    EmpresaModule,
    UsuariosModule,
    ClientesModule,
    ProdutosModule,
    VendasModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}