import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';

export interface MenuItem {
  idMenuItem: number;
  name: string;
  price: number;
  categoryId: number;
}

@Injectable({
  providedIn: 'root'
})
export class MenuItemService extends GenericService<MenuItem> {
  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    super(http, `${apiUrl}/menuitems`);
  }
}

