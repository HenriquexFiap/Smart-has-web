import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AppointmentsService, Appointment } from '../core/appointments.service';

@Component({
  selector: 'app-agendamentos-novo',
  standalone: true,
  imports: [
    RouterLink, ReactiveFormsModule, NgIf, NgFor,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatDatepickerModule, MatNativeDateModule, MatSelectModule,
    MatButtonModule, MatIconModule
  ],
  templateUrl: './agendamentos-novo.component.html',
  styleUrl: './agendamentos-novo.component.css'
})
export class AgendamentosNovoComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(AppointmentsService);

  // horários simples pra seleção
  horarios = [
    '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00',
    '13:30', '14:00', '14:30', '15:00'
  ];

  // mapeia especialidade -> lista de médicos disponíveis (mock)
  private doctorsBySpecialty: Record<string, string[]> = {
    'Cardiologia': ['Dr. Oswaldo Cruz', 'Dr. Alexandre Lima'],
    'Dermatologia': ['Dra. Paula Fernandes', 'Dra. Juliana Prado'],
    'Neurologia': ['Dr. Marcos Andrade', 'Dra. Camila Nogueira'],
    'Ortopedia': ['Dr. João Ribeiro', 'Dra. Marina Costa'],
    'Clínica Geral': ['Dra. Ana Bezerra', 'Dr. Pedro Silveira'],
  };

  // form
  form = this.fb.group({
    specialty: ['', Validators.required],
    date: [null as Date | null, Validators.required],
    time: ['', Validators.required]
  });

  // estado
  espDaTriagem = signal<string | null>(null);

  ngOnInit() {
    // Se veio da triagem (?esp=Cardiologia), pré-preenche
    const esp = this.route.snapshot.queryParamMap.get('esp');
    if (esp) {
      this.espDaTriagem.set(esp);
      this.form.patchValue({ specialty: esp });
    }
  }

  // escolhe um médico da especialidade (mock simples)
  private pickDoctor(specialty: string): string {
    const list = this.doctorsBySpecialty[specialty] || ['Dr(a). Disponível'];
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
  }

  private fmtData(d: Date): string {
    // formato simples dd/mm/aaaa
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  confirmar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { specialty, date, time } = this.form.value;
    const doctorName = this.pickDoctor(String(specialty));

    const item: Appointment = {
      id: String(Date.now()),
      doctorName,
      specialty: String(specialty),
      date: this.fmtData(date as Date),
      time: String(time),
      patient: 'Você'
    };

    this.store.add(item);

    // volta para a lista já filtrando pela especialidade, se existir
    this.router.navigate(['/agendamentos'], {
      queryParams: { esp: specialty || null }
    });
  }

  voltar() {
    // volta para lista (mantendo filtro se veio da triagem)
    const esp = this.espDaTriagem();
    this.router.navigate(['/agendamentos'], {
      queryParams: { esp: esp || null }
    });
  }
}
