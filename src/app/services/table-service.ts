import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';
import { Subject } from 'rxjs';

export interface Table {
  idTable: number;
  number: string;
  capacity: number;
  location: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TableService extends GenericService<Table> {

  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    super(http, `${apiUrl}/tables`);
  }

}
