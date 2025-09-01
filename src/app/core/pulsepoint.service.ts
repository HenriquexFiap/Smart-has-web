import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PulsePointService {
  private http = inject(HttpClient);
  private base = environment.apiUrl?.replace(/\/+$/, '') || 'http://localhost:8080';

  private jsonHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  /** ---- Utilidades genéricas ---- */
  private handleError(err: HttpErrorResponse) {
    console.error('[PulsePointService] HTTP error:', err);
    const msg = err.error?.message || err.message || 'Erro de rede';
    return throwError(() => new Error(msg));
  }

  private get<T>(path: string, params?: Record<string,string|number>): Observable<T> {
    const url = `${this.base}${path}`;
    return this.http.get<T>(url, { params: params as any }).pipe(catchError(this.handleError));
  }

  private post<T>(path: string, body: unknown): Observable<T> {
    const url = `${this.base}${path}`;
    return this.http.post<T>(url, body, { headers: this.jsonHeaders }).pipe(catchError(this.handleError));
  }

  /** ---- Teste de conexão (usando o JSON do Swagger do springdoc) ----
   * O backend do seu colega expõe o UI em /docs e o JSON em /v3/api-docs.
   */
  pingSwagger(): Observable<{title?: string; version?: string}> {
    return this.get<any>('/v3/api-docs').pipe(
      map(doc => ({ title: doc?.info?.title, version: doc?.info?.version }))
    );
  }

  /** --------- Exemplos de endpoints (AJUSTAR quando soubermos a rota real) ---------- */

  // 1) Triagem: envia sintomas e recebe especialidade sugerida
  analisarSintomas(sintomas: string): Observable<{ specialty: string }> {
    // AJUSTE a rota conforme o backend (ex.: /triagem/analisar ou /triagem)
    return this.post<{ specialty: string }>('/triagem/analisar', { sintomas });
  }

  // 2) Agendamentos - listar
  listarAgendamentos(): Observable<Array<{
    id: string;
    doctorName: string;
    specialty: string;
    date: string; // ISO ou "dd/MM/yyyy" conforme backend
    time: string; // "HH:mm"
  }>> {
    // AJUSTE a rota conforme o backend (ex.: /agendamentos)
    return this.get('/agendamentos');
  }

  // 3) Agendamentos - criar
  criarAgendamento(payload: {
    specialty: string;
    date: string; // '2025-09-01'
    time: string; // '09:30'
    doctorName?: string; // se o backend aceitar
  }): Observable<{ id: string }> {
    // AJUSTE a rota conforme o backend (ex.: /agendamentos)
    return this.post<{ id: string }>('/agendamentos', payload);
  }

  // 4) Agendamentos - detalhes
  obterAgendamento(id: string): Observable<{
    id: string;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    patient?: string;
  }> {
    // AJUSTE a rota conforme o backend (ex.: /agendamentos/{id})
    return this.get(`/agendamentos/${id}`);
  }

  // 5) Agendamentos - cancelar
  cancelarAgendamento(id: string): Observable<void> {
    // Se o backend tiver DELETE
    const url = `${this.base}/agendamentos/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.handleError));
  }

  // 6) Login / Signup (se o backend tiver)
  login(email: string, senha: string): Observable<{ token: string }> {
    return this.post('/auth/login', { email, senha });
  }

  signup(data: { nome: string; email: string; senha: string }): Observable<{ id: string }> {
    return this.post('/auth/signup', data);
  }
}
