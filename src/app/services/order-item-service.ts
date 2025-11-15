import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';
import { Subject } from 'rxjs';
import { OrderItem } from '../model/orderitem';



@Injectable({
  providedIn: 'root'
})
export class OrderItemService extends GenericService<OrderItem> {

  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    super(http, `${apiUrl}/orderitems`);
  }
}
