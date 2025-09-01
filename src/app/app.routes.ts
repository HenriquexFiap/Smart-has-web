// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';

import { TriagemComponent } from './features/triagem/triagem.component';
import { AgendamentosComponent } from './features/agendamentos/agendamentos.component';
import { AgendamentosDetalhesComponent } from './features/agendamentos/agendamentos-detalhes.component';
import { AgendamentosNovoComponent } from './features/agendamentos-novo/agendamentos-novo.component';

// 👇 importa o Settings (pode estar em features/settings ou configuracoes,
// use o caminho que você criou. Abaixo estou usando /features/settings/)
import { SettingsComponent } from './features/settings/settings.component';

import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // rotas protegidas
  { path: 'triagem', component: TriagemComponent, canActivate: [authGuard] },
  { path: 'agendamentos', component: AgendamentosComponent, canActivate: [authGuard] },
  { path: 'agendamentos/novo', component: AgendamentosNovoComponent, canActivate: [authGuard] },
  { path: 'agendamentos/:id', component: AgendamentosDetalhesComponent, canActivate: [authGuard] },

  // 🔵 nova rota protegida de Configurações
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },

  // fallback
  { path: '**', redirectTo: '' }
];
