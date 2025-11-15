import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';
import { Subject } from 'rxjs';

export interface Payment {
  idPayment: number;
  orderId: number;
  amount: number;
  paymentDate: string;
  method: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends GenericService<Payment> {

  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    super(http, `${apiUrl}/payments`);
  }

}

