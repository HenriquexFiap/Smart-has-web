// src/app/features/settings/settings.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../core/auth.service';
import { User } from '../../core/models/api.types';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    // Angular
    NgIf, RouterLink, ReactiveFormsModule,
    // Material
    MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatDividerModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // estado
  carregando = signal(true);
  salvando   = signal(false);
  erro       = signal<string | null>(null);

  // usuário atual
  usuario = signal<User | null>(null);

  // form reativo (phone e birthdate são opcionais e ficam no localStorage por enquanto)
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [localStorage.getItem('pp_phone') ?? ''],
    birthdate: [localStorage.getItem('pp_birth') ?? ''],
    // backend atual exige senha para atualizar? deixamos no form, mas enviamos só se quiser
    password: ['']
  });

  // letra do avatar
  primeiraLetra = computed(() => {
    const n = this.usuario()?.name ?? 'P';
    return n.trim().charAt(0).toUpperCase() || 'P';
  });

  ngOnInit() {
    this.carregando.set(true);
    this.auth.getLogged().subscribe({
      next: (u) => {
        this.usuario.set(u);
        // preenche o formulário com nome e email vindos do backend
        this.form.patchValue({
          name: u.name ?? '',
          email: u.email ?? ''
        });
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
        // se não está logado/uuid inválido → volta pro login
        this.router.navigate(['/login']);
      }
    });
  }

  salvar() {
    this.erro.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.erro.set('Preencha os campos obrigatórios corretamente.');
      return;
    }

    this.salvando.set(true);

    const { name, email, phone, birthdate, password } = this.form.getRawValue();

    // Salva opcionais localmente (enquanto não há endpoint oficial)
    localStorage.setItem('pp_phone', phone || '');
    localStorage.setItem('pp_birth', birthdate || '');

    // monta payload mínimo que o backend aceita (name/email).
    // Se seu backend exigir senha para atualizar, descomente abaixo e
    // ajuste o service para mandar também { password }.
    const payload: Partial<User> & { password?: string } = { name, email };
    if (password && password.trim().length > 0) {
      payload.password = password.trim();
    }

    this.auth.updateProfile(payload).subscribe({
      next: (updated) => {
        // atualiza o sinal de usuário para refletir o que veio do backend
        this.usuario.set({
          ...(this.usuario() ?? {} as User),
          ...updated,
        } as User);

        // limpa o campo de senha após salvar
        this.form.patchValue({ password: '' });

        this.salvando.set(false);
      },
      error: () => {
        this.salvando.set(false);
        this.erro.set('Não foi possível salvar as alterações. Tente novamente.');
      }
    });
  }

  logout() {
    this.auth.clearSession();
    this.router.navigate(['/login']);
  }

  excluirConta() {
    const ok = confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');
    if (!ok) return;

    this.auth.deleteAccount().subscribe({
      next: () => {
        this.auth.clearSession();
        this.router.navigate(['/']);
      },
      error: () => {
        this.erro.set('Falha ao excluir conta. Tente novamente.');
      }
    });
  }
}
