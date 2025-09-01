// src/app/core/triage.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TriageFormsDTO } from './models/api.types';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TriageService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  create(dto: TriageFormsDTO): Observable<TriageFormsDTO> {
    return this.http.post<TriageFormsDTO>(`${this.base}/api/triage`, dto);
  }

  list(): Observable<TriageFormsDTO[]> {
    return this.http.get<TriageFormsDTO[]>(`${this.base}/api/triage`);
  }

  getById(id: number): Observable<TriageFormsDTO> {
    return this.http.get<TriageFormsDTO>(`${this.base}/api/triage/${id}`);
  }
}
