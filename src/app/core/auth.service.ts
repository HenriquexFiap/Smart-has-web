// src/app/core/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, UserRequest, User } from './models/api.types';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  /** Guarda a sessão (uuid) */
  private saveSession(token: LoginResponse) {
    localStorage.setItem('pp_uuid', token.uuid);
    localStorage.setItem('pp_uuid_exp', token.uuidExpire);
  }

  get uuid(): string | null {
    return localStorage.getItem('pp_uuid');
  }

  clearSession() {
    localStorage.removeItem('pp_uuid');
    localStorage.removeItem('pp_uuid_exp');
  }

  // ---------- ENDPOINTS ----------

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/login`, payload).pipe(
      tap(res => this.saveSession(res))
    );
  }

  signup(payload: UserRequest): Observable<User> {
    // POST /users  (conforme Swagger)
    return this.http.post<User>(`${this.base}/users`, payload);
  }

  getLogged(): Observable<User> {
    // GET /users/logged
    return this.http.get<User>(`${this.base}/users/logged`);
  }

  listUsers(): Observable<User[]> {
    // GET /users
    return this.http.get<User[]>(`${this.base}/users`);
  }

  /** Atualiza nome/email (e opcionalmente senha) – PUT /users */
  updateProfile(payload: Partial<User> & { password?: string }): Observable<User> {
    return this.http.put<User>(`${this.base}/users`, payload);
  }

  /** Exclui a conta logada – DELETE /users */
  deleteAccount(): Observable<void> {
    return this.http.delete<void>(`${this.base}/users`);
  }
}
