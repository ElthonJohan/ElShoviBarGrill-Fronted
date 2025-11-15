import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';
import { Subject } from 'rxjs';

export interface Order {
  idOrder: number;
  userId: number;
  tableId: number;
  total: number;
  date: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService extends GenericService<Order> {
  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    super(http, `${apiUrl}/orders`);
  }


}
