import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';

export interface OrderItem {
  idOrderItem: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderItemService extends GenericService<OrderItem> {
  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    super(http, `${apiUrl}/orderitems`);
  }
}
