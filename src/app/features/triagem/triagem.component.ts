// src/app/features/triagem/triagem.component.ts
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

// Serviço para salvar/ler triagens no backend
import { TriageService } from '../../core/triage.service';
import { TriageFormsDTO } from '../../core/models/api.types';

@Component({
  selector: 'app-triagem',
  standalone: true,
  imports: [
    // Angular
    FormsModule, RouterLink, NgIf, NgFor,
    // Material
    MatCardModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatChipsModule, MatDividerModule,
  ],
  templateUrl: './triagem.component.html',
  styleUrl: './triagem.component.css'
})
export class TriagemComponent {
  private router = inject(Router);
  private triage = inject(TriageService);

  // modelo da tela
  sintomas = '';
  especialidade: string | null = null;

  // feedback e estado
  salvando = false;
  salvo = false;
  erro: string | null = null;

  // histórico vindo do backend
  historico: TriageFormsDTO[] = [];

  ngOnInit() {
    this.carregarHistorico();
  }

  /** Regras simples de sugestão de especialidade */
  private sugerirEspecialidade(texto: string): string {
    const s = texto.toLowerCase();
    const regras = [
      { rx: /(coração|peito|taquic|palpita|falta de ar|pressão|hipertens)/, esp: 'Cardiologia' },
      { rx: /(pele|mancha|coceira|acne|dermatit|eczema)/, esp: 'Dermatologia' },
      { rx: /(cabeça|enxaquec|tontura|convuls|formig|neurol)/, esp: 'Neurologia' },
      { rx: /(tosse|asma|pulmão|respira|pneumo|fôlego)/, esp: 'Pneumologia' },
      { rx: /(estômago|abd[oô]men|náusea|diarreia|gastrite|azia)/, esp: 'Gastroenterologia' },
    ];
    const m = regras.find(r => r.rx.test(s));
    return m ? m.esp : 'Clínica Geral';
  }

  /** Passo 1: analisar + salvar no backend + mostrar feedback */
  analisarSintomas(): void {
    this.erro = null;
    this.salvo = false;

    const texto = (this.sintomas || '').trim();
    if (!texto) {
      this.erro = 'Descreva seus sintomas para analisarmos.';
      return;
    }

    this.especialidade = this.sugerirEspecialidade(texto);

    // salva triagem no backend
    this.salvando = true;
    this.triage.create({ sintomas: texto }).subscribe({
      next: (res) => {
        this.salvando = false;
        this.salvo = true;
        // insere no topo do histórico
        this.historico = [{ id: res.id, sintomas: res.sintomas }, ...this.historico];
      },
      error: () => {
        this.salvando = false;
        this.erro = 'Não foi possível salvar sua triagem agora.';
      }
    });
  }

  /** Botão principal: analisar e já navegar para novo agendamento com a especialidade */
  analisarESeguir(): void {
    this.analisarSintomas();
    if (this.especialidade) {
      this.router.navigate(['/agendamentos/novo'], {
        queryParams: { esp: this.especialidade }
      });
    }
  }

  /** Carrega histórico para exibir na seção "Histórico recente" */
  private carregarHistorico(): void {
    this.triage.list().subscribe({
      next: (lista) => {
        // Mostra os mais recentes primeiro (se backend não ordenar)
        this.historico = (lista ?? []).slice().reverse();
      },
      error: () => {
        // silencioso: não bloqueia a tela se falhar
        this.historico = [];
      }
    });
  }
}
