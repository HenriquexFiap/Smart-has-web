import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar class="toolbar" color="primary">
      <div class="brand" routerLink="/" style="cursor:pointer">
        <img class="logo" src="assets/images/PulsePointLogo.jpg" alt="Pulse Point" />
        <span class="title">Pulse&nbsp;Point</span>
      </div>

      <span class="spacer"></span>

      <!-- Quando NÃO logado -->
      <ng-container *ngIf="!isLoggedIn(); else logged">
        <a mat-stroked-button color="primary" routerLink="/login">
          <mat-icon>login</mat-icon>
          Entrar
        </a>
        <a mat-raised-button color="primary" routerLink="/signup">
          <mat-icon>person_add</mat-icon>
          Criar conta
        </a>
      </ng-container>

      <!-- Quando logado -->
      <ng-template #logged>
        <a mat-stroked-button color="primary" routerLink="/agendamentos">
          <mat-icon>event</mat-icon>
          Agendamentos
        </a>
        <button mat-raised-button color="primary" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Sair
        </button>
      </ng-template>
    </mat-toolbar>
  `,
  styles: [`
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      height: 68px;
      display: flex;
      gap: 12px;
      /* banda azul clara, combinando com as telas */
      background: linear-gradient(180deg, #eaf2ff 0%, #dfeafc 100%);
      border-bottom: 1px solid #c8d8fb;
      color: #1d2b4f;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo {
      height: 36px; width: auto; object-fit: contain;
      filter: drop-shadow(0 1px 1px rgba(0,0,0,.06));
      border-radius: 4px;
      background: #fff;
    }
    .title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: .3px;
      color: #1e3a8a; /* nosso azul título */
      text-transform: uppercase;
    }
    .spacer { flex: 1; }

    a[mat-stroked-button], button[mat-raised-button], a[mat-raised-button] {
      margin-left: 10px;
    }

    @media (max-width: 600px) {
      .title { display: none; }
      .toolbar { gap: 6px; height: 60px; }
      a[mat-stroked-button], button[mat-raised-button], a[mat-raised-button] {
        padding: 0 10px;
      }
    }
  `]
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = computed(() => !!this.auth.uuid);

  logout() {
    this.auth.clearSession();
    this.router.navigate(['/login']);
  }
}
