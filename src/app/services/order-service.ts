import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';
import { Observable } from 'rxjs';
import { Order } from '../model/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends GenericService<Order> {
  private uri: string;

  constructor(
    http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    super(http, `${apiUrl}/orders`);
    this.uri = `${apiUrl}/orders`;
  }

  // Guardar nueva orden (override opcional si tu GenericService ya tiene save)
  override save(order: Order): Observable<Order> {
    return this.http.post<Order>(this.uri, order);
  }

  // Crear orden usando tu endpoint createFromDto
  createOrder(order: any): Observable<Order> {
    return this.http.post<Order>(`${this.uri}/createFromDto`, order);
  }

  // Registrar pago de una orden
  payOrder(idOrder: number, paymentMethod: string): Observable<any> {
    return this.http.post(`${this.uri}/${idOrder}/pay`, { paymentMethod });
  }

  // Verificar si la mesa tiene otras órdenes activas
  checkMesaDisponible(idMesa: number, idOrder?: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.uri}/checkMesa/${idMesa}?exclude=${idOrder || ''}`);
  }

  // Saber si la mesa está ocupada
  mesaOcupada(idTable: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.uri}/mesa/ocupada/${idTable}`);
  }
}
