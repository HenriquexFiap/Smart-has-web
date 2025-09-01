// src/app/features/agendamentos-novo/agendamentos-novo.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AppointmentsService } from '../core/appointments.service';

@Component({
  selector: 'app-agendamentos-novo',
  standalone: true,
  imports: [
    RouterLink, ReactiveFormsModule, NgIf, NgFor,
    MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './agendamentos-novo.component.html',
  styleUrl: './agendamentos-novo.component.css'
})
export class AgendamentosNovoComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(AppointmentsService);

  horarios = [
    '08:00','08:30','09:00','09:30','10:00','10:30',
    '11:00','11:30','14:00','14:30','15:00','15:30'
  ];

  // especialidade que pode vir da triagem por query param (esp)
  espDaTriagem = signal<string | null>(null);

  form = this.fb.group({
    specialty: ['', Validators.required],
    date: [null as Date | null, Validators.required],
    time: ['', Validators.required]
  });

  ngOnInit() {
    const esp = this.route.snapshot.queryParamMap.get('esp');
    if (esp) {
      this.espDaTriagem.set(esp);
      this.form.patchValue({ specialty: esp });
    }
  }

  voltar() {
    this.router.navigate(['/agendamentos'], { queryParams: { esp: this.form.value.specialty || null } });
  }

  confirmar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { specialty, date, time } = this.form.value;

    // formata a data (pode ser só string)
    const dataFmt = date instanceof Date
      ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
      : String(date);

    // escolhe um médico de exemplo pela especialidade
    const medico = this.pickDoctor(String(specialty));

    // salva no serviço (PERSISTE no localStorage)
    const novo = this.store.add({
      doctorName: medico,
      specialty: String(specialty),
      date: dataFmt,
      time: String(time),
      patient: null
    });

    // navega para a lista com o filtro da especialidade
    this.router.navigate(['/agendamentos'], { queryParams: { esp: specialty || null } });
  }

  private pickDoctor(esp: string): string {
    const porEsp: Record<string, string[]> = {
      'Cardiologia': ['Dr. Oswaldo Cruz', 'Dra. Paula Fernandes'],
      'Dermatologia': ['Dra. Camila Nogueira', 'Dra. Juliana Prado'],
      'Neurologia': ['Dr. Alexandre Lima', 'Dr. Marcos Andrade'],
      'Ortopedia': ['Dr. Marcos Andrade', 'Dr. Alexandre Lima'],
      'Clínica Geral': ['Dra. Juliana Prado', 'Dr. Alexandre Lima'],
    };
    const lista = porEsp[esp] ?? ['Dr. Alexandre Lima'];
    return lista[Math.floor(Math.random() * lista.length)];
  }
}
