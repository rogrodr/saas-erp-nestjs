import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VendasComponent } from './pages/vendas/vendas.component';
import { ComprasComponent } from './pages/compras/compras.component';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { FinanceiroComponent } from './pages/financeiro/financeiro.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { FornecedoresComponent } from './pages/fornecedores/fornecedores.component';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';
import { ConfiguracoesComponent } from './pages/configuracoes/configuracoes.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'vendas', component: VendasComponent },
      { path: 'compras', component: ComprasComponent },
      { path: 'estoque', component: EstoqueComponent },
      { path: 'financeiro', component: FinanceiroComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'fornecedores', component: FornecedoresComponent },
      { path: 'relatorios', component: RelatoriosComponent },
      { path: 'configuracoes', component: ConfiguracoesComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
