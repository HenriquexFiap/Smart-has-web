import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-triagem',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIf,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './triagem.component.html',
  styleUrl: './triagem.component.css'
})
export class TriagemComponent {
  sintomas = '';
  especialidade: string | null = null;

  analisarSintomas(): void {
    const s = this.sintomas.toLowerCase();

    const regras = [
      { rx: /(coração|peito|taquic|palpita|falta de ar|pressão|hipertens)/, esp: 'Cardiologia' },
      { rx: /(pele|mancha|coceira|acne|dermatit|eczema)/, esp: 'Dermatologia' },
      { rx: /(cabeça|enxaquec|tontura|convuls|formig|neurol)/, esp: 'Neurologia' },
      { rx: /(tosse|asma|pulmão|respira|pneumo|fôlego)/, esp: 'Pneumologia' },
      { rx: /(estômago|abd[oô]men|náusea|diarreia|gastrite|azia)/, esp: 'Gastroenterologia' },
    ];

    const match = regras.find(r => r.rx.test(s));
    this.especialidade = match ? match.esp : 'Clínica Geral';
  }
}
