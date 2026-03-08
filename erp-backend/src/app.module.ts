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
import { FornecedoresModule } from './fornecedores/fornecedores.module';
import { ComprasModule } from './compras/compras.module';
import { ContasPagarModule } from './contas-pagar/contas-pagar.module';
import { ContasReceberModule } from './contas-receber/contas-receber.module';
import { HistoricoPrecosModule } from './historico-precos/historico-precos.module';

@Module({
  imports: [
    PrismaModule,
    EmpresaModule,
    UsuariosModule,
    ClientesModule,
    ProdutosModule,
    VendasModule,
    AuthModule,
    FornecedoresModule,
    ComprasModule,
    ContasPagarModule,
    ContasReceberModule,
    HistoricoPrecosModule,
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