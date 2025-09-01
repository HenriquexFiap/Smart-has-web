// src/app/core/appointments.service.ts
import { Injectable, signal } from '@angular/core';

export type Appointment = {
  id: string;
  doctorName: string;
  specialty: string;
  date: string; // ISO ou texto simples
  time: string; // "09:30"
  patient?: string | null;
};

const STORAGE_KEY = 'pp_apts';

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  /** estado interno */
  private _items = signal<Appointment[]>(this.load());

  /** lê do localStorage */
  private load(): Appointment[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as Appointment[] : [];
    } catch {
      return [];
    }
  }

  /** grava no localStorage */
  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
  }

  /** lista (array) para usar no componente */
  list(): Appointment[] {
    return this._items();
  }

  /** retorna por id */
  getById(id: string): Appointment | null {
    return this._items().find(a => a.id === id) ?? null;
  }

  /** cria id simples */
  private genId(): string {
    return (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  }

  /** adiciona */
  add(input: Omit<Appointment, 'id'>): Appointment {
    const novo: Appointment = { id: this.genId(), ...input };
    this._items.update(arr => [novo, ...arr]);
    this.persist();
    return novo;
  }

  /** remove */
  remove(id: string) {
    this._items.update(arr => arr.filter(a => a.id !== id));
    this.persist();
  }

  /** atualiza */
  update(id: string, patch: Partial<Omit<Appointment, 'id'>>) {
    this._items.update(arr =>
      arr.map(a => (a.id === id ? { ...a, ...patch } : a))
    );
    this.persist();
  }
}
