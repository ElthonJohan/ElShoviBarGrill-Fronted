import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';
import { Subject } from 'rxjs';

export interface Delivery {
  idDelivery: number;
  orderId: number;
  address: string;
  status: string;
  deliveryDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryService extends GenericService<Delivery> {
  
  

  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    super(http, `${apiUrl}/deliveries`);
  }

}
