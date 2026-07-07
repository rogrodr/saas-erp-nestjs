import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  user: { email: string; empresaId?: number } | null = null;

  menu = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Vendas', icon: 'pi pi-shopping-cart', route: '/vendas' },
    { label: 'Compras', icon: 'pi pi-briefcase', route: '/compras' },
    { label: 'Estoque', icon: 'pi pi-box', route: '/estoque' },
    { label: 'Financeiro', icon: 'pi pi-wallet', route: '/financeiro' },
    { label: 'Clientes', icon: 'pi pi-users', route: '/clientes' },
    { label: 'Fornecedores', icon: 'pi pi-id-card', route: '/fornecedores' },
    { label: 'Relatórios', icon: 'pi pi-chart-bar', route: '/relatorios' },
    { label: 'Configurações', icon: 'pi pi-cog', route: '/configuracoes' },
  ];

  constructor(private readonly authService: AuthService, private readonly router: Router) {
    this.user = this.authService.getStoredUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
