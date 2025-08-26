import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TriagemComponent } from './features/triagem/triagem.component';
import { AgendamentosComponent } from './features/agendamentos/agendamentos.component';
import { AgendamentosDetalhesComponent } from './features/agendamentos/agendamentos-detalhes.component';
import { AgendamentosNovoComponent } from './features/agendamentos-novo/agendamentos-novo.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'triagem', component: TriagemComponent },

  // 👉 FIX: a rota fixa vem antes da dinâmica
  { path: 'agendamentos/novo', component: AgendamentosNovoComponent },
  { path: 'agendamentos/:id', component: AgendamentosDetalhesComponent },
  { path: 'agendamentos', component: AgendamentosComponent },
];
