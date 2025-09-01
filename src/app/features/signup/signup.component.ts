// signup.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule, NgIf,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  nome = '';
  email = '';
  senha = '';
  telefone = '';
  nascimento = '';
  erro: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  criarConta() {
    this.erro = null;

    const payload = {
      name: this.nome,
      email: this.email,
      password: this.senha,
      role: 'paciente'  // 🔑 igual ao que funciona no Swagger
    };

    this.auth.signup(payload).subscribe({
      next: () => {
        alert('Conta criada com sucesso!');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.erro = 'Erro ao criar conta';
      }
    });
  }
}
