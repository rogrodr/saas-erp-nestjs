import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule, ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  user: { email: string; empresaId?: number } | null = null;

  constructor(private readonly authService: AuthService, private readonly router: Router) {
    this.user = this.authService.getStoredUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
