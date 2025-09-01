// src/app/features/agendamentos/agendamentos.component.ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, NgFor, DatePipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AppointmentsService, Appointment } from '../core/appointments.service';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, DatePipe, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './agendamentos.component.html',
  styleUrl: './agendamentos.component.css'
})
export class AgendamentosComponent {
  private store = inject(AppointmentsService);
  private route = inject(ActivatedRoute);

  especialidadeSelecionada: string | null = null;

  ngOnInit() {
    this.especialidadeSelecionada = this.route.snapshot.queryParamMap.get('esp');
  }

  /** Getter usado no template (array “normal”) */
  get agendamentosList(): Appointment[] {
    const todos = this.store.list();
    const esp = this.especialidadeSelecionada;
    return esp ? todos.filter(a => a.specialty === esp) : todos;
  }
}
