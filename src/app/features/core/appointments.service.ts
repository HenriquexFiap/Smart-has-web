import { Injectable, signal } from '@angular/core';

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;   // "2025-07-12"
  time: string;   // "09:30"
  patient?: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  private _list = signal<Appointment[]>([]);

  list() {
    return this._list();
  }

  getById(id: string) {
    return this._list().find(a => a.id === id) || null;
  }

  add(item: Appointment) {
    this._list.update(curr => [...curr, item]);
  }

  update(id: string, partial: Partial<Appointment>) {
    this._list.update(curr =>
      curr.map(a => (a.id === id ? { ...a, ...partial } : a))
    );
  }

  remove(id: string) {
    this._list.update(curr => curr.filter(a => a.id !== id));
  }
}
