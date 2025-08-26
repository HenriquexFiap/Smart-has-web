import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AppointmentsService, Appointment } from '../core/appointments.service';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './agendamentos.component.html',
  styleUrl: './agendamentos.component.css'
})
export class AgendamentosComponent {
  private route = inject(ActivatedRoute);
  private store = inject(AppointmentsService);

  // vindo por query param (?esp=Cardiologia)
  especialidadeSelecionada?: string;

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.especialidadeSelecionada = params.get('esp') || undefined;
    });
  }

  // lista final que o template usa
  get agendamentosList(): Appointment[] {
    const esp = this.especialidadeSelecionada;
    const data: Appointment[] = this.store.list() ?? [];
    return esp ? data.filter((a: Appointment) => a.specialty === esp) : data;
  }
}
