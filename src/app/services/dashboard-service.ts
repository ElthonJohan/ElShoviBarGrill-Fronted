import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces que mapean tus DTOs del backend
export interface DashboardStats {
  ventasHoy: number;
  pedidosActivos: number;
  clientesHoy: number;
  reservasHoy: number;
}

export interface VentasDiarias {
  fecha: string; // viene como '2025-11-17'
  total: number;
}

export interface CategoriaVentas {
  categoria: string;
  cantidadVendida: number;
}

export interface MetodoPago {
  metodo: string;
  total: number;
}

export interface VentasPorUsuario {
  usuario: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'http://localhost:9090/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats`);
  }

  getVentasDiarias(): Observable<VentasDiarias[]> {
    return this.http.get<VentasDiarias[]>(`${this.baseUrl}/ventas-diarias`);
  }

  getCategoriasMasVendidas(): Observable<CategoriaVentas[]> {
    return this.http.get<CategoriaVentas[]>(`${this.baseUrl}/categorias-mas-vendidas`);
  }

  getMetodosPago(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(`${this.baseUrl}/metodos-pago`);
  }

  getVentasPorUsuario(): Observable<VentasPorUsuario[]> {
    return this.http.get<VentasPorUsuario[]>(`${this.baseUrl}/ventas-por-usuario`);
  }
}
