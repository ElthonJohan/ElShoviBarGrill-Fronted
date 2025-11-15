import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';
import { Subject } from 'rxjs';
import { Order } from '../model/order';



@Injectable({
  providedIn: 'root'
})
export class OrderService extends GenericService<Order> {
  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    super(http, `${apiUrl}/orders`);
  }


}
