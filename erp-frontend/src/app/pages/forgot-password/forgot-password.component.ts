import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CardModule, InputTextModule, ButtonModule, MessageModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = false;
  message = '';
  error = '';

  constructor(private readonly fb: FormBuilder, private readonly http: HttpClient) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';
    this.error = '';

    this.http.post(`${environment.apiUrl}/auth/recuperar-senha`, this.form.value).subscribe({
      next: () => {
        this.message = 'Se o e-mail estiver cadastrado, as instruções foram enviadas.';
      },
      error: () => {
        this.error = 'Não foi possível processar a solicitação.';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
