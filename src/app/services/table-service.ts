import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';
import { Subject } from 'rxjs';
import { Table } from '../model/table';

@Injectable({
  providedIn: 'root'
})
export class TableService extends GenericService<Table> {


  private uri: string;

  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    super(http, `${apiUrl}/tables`);
    this.uri = `${apiUrl}/tables`;
  }


}
