import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';
import { Subject } from 'rxjs';
import { Reservation } from '../model/reservation';


@Injectable({
  providedIn: 'root'
})
export class ReservationService extends GenericService<Reservation> {
 
  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    super(http, `${apiUrl}/reservations`);
  }

}
