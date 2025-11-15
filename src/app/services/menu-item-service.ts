import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';
import { Subject } from 'rxjs';
import { MenuItem } from '../model/menuitem';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService extends GenericService<MenuItem> {

  
  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    super(http, `${apiUrl}/menuitems`);
  }
}

