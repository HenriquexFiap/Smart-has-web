import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule, RouterLink, NgIf,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  senha = '';
  erro: string | null = null;
  loading = false;

  private nextUrl(): string {
    const ret = this.route.snapshot.queryParamMap.get('returnUrl');
    return ret || '/triagem';
    }

  logar() {
    this.erro = null;
    if (!this.email || !this.senha) {
      this.erro = 'Informe email e senha.';
      return;
    }
    this.loading = true;
    this.auth.login({ email: this.email, password: this.senha }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl(this.nextUrl());
      },
      error: () => {
        this.loading = false;
        this.erro = 'Usuário ou senha inválidos.';
      }
    });
  }
}
