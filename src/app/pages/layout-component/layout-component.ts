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

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, 
    MatToolbarModule,
    MatSidenavModule,
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
  isCollapsed = false;
   isDarkMode = false;
  userName = '';

  constructor(private router: Router) {}


  toggleSidebar() {
  this.isCollapsed = !this.isCollapsed;
}  

  ngOnInit() {
    this.loadUserName();
  }

  // Detecta si hay sesión
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  // Carga nombre del user si está guardado
  loadUserName() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userName = user.fullName || user.username || 'Usuario';
    }
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

}
