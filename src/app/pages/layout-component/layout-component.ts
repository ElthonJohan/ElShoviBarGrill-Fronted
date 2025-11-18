import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatActionList, MatNavList } from '@angular/material/list';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, 
    MatToolbarModule,
    MatSidenavModule,
    MatNavList,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './layout-component.html',
  styleUrls: ['./layout-component.css']
})
export class LayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private router: Router) {}

  // Retorna true si hay usuario logueado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user'); // O usar un AuthService
  }

  // Cierra sesión
  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
