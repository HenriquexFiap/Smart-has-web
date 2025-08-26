import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AppointmentsService, Appointment } from '../core/appointments.service';

@Component({
  selector: 'app-agendamentos-detalhes',
  standalone: true,
  imports: [
    RouterLink, NgIf,
    MatCardModule, MatDividerModule, MatChipsModule,
    MatButtonModule, MatIconModule
  ],
  templateUrl: './agendamentos-detalhes.component.html',
  styleUrl: './agendamentos-detalhes.component.css'
})
export class AgendamentosDetalhesComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(AppointmentsService);

  id = signal<string | null>(null);
  apt = signal<Appointment | null>(null); // <- público

  private photoByDoctor: Record<string, string> = {
    'Dr. Oswaldo Cruz': 'assets/images/doctors/oswaldo.jpg',
    'Dra. Paula Fernandes': 'assets/images/doctors/paula.jpg',
    'Dr. Alexandre Lima': 'assets/images/doctors/alexandre.jpg',
    'Dr. Marcos Andrade': 'assets/images/doctors/marcos.jpg',
    'Dra. Juliana Prado': 'assets/images/doctors/juliana.jpg',
    'Dra. Camila Nogueira': 'assets/images/doctors/camila.jpg',
  };

  photoUrl = computed(() => {
    const a = this.apt();
    if (!a) return null;
    return this.photoByDoctor[a.doctorName] ?? null;
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.id.set(id);
    if (id) this.apt.set(this.store.getById(id));
  }

  editar() {
    const id = this.id();
    if (!id) return;
    this.router.navigate(['/agendamentos/novo'], { queryParams: { edit: id } });
  }

  desmarcar() {
    const id = this.id();
    if (!id) return;
    const ok = confirm('Tem certeza que deseja desmarcar este agendamento?');
    if (ok) {
      this.store.remove(id);
      this.router.navigate(['/agendamentos']);
    }
  }
}
