import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    DividerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      empresaId: [1, [Validators.required]],
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    try {
      await this.authService.register(this.form.value);
      this.successMessage = 'Cadastro realizado com sucesso. Você já pode entrar.';
      setTimeout(() => this.router.navigate(['/login']), 1200);
    } catch (error: any) {
      if (error.status === 500) {
        this.errorMessage = 'Erro no servidor. Verifique se o backend está ativo em http://localhost:3000';
      } else if (error.error?.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = 'Não foi possível concluir o cadastro. Tente novamente.';
      }
    } finally {
      this.loading = false;
    }
  }
}
