import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';
import { Observable, Subject } from 'rxjs';
import { Order } from '../model/order';



@Injectable({
  providedIn: 'root'
})
export class OrderService extends GenericService<Order> {
  private uri: string;
  constructor(
    http: HttpClient,
     @Inject('API_URL') apiUrl: string) 
     {
    super(http, `${apiUrl}/orders`);
    this.uri = `${apiUrl}/orders`;
  }

override save(order: Order): Observable<Order> {
  return this.http.post<Order>(this.uri, order);
}

payOrder(idOrder: number, paymentMethod: string) {
  return this.http.post(`${this.uri}/${idOrder}/pay`, {
    paymentMethod: paymentMethod
  });
}


checkMesaDisponible(idMesa: number, idOrder?: number) {
  return this.http.get<boolean>(`${this.uri}/checkMesa/${idMesa}?exclude=${idOrder || ''}`);
}


mesaOcupada(idTable: number) {
  return this.http.get<boolean>(`${this.uri}/mesa/ocupada/${idTable}`);
}



}
