import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';
import { Observable, Subject } from 'rxjs';
import { MenuItem } from '../model/menuitem';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService extends GenericService<MenuItem> {

  private baseUrl: string;
  private apiUri: string ;
  
  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    super(http, `${apiUrl}/menu-items`);
    this.apiUri = apiUrl;
    this.baseUrl = `${apiUrl}`;
  }
  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories/active`);
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUri}/menu-items/active`);
  }
  getProductsByCategory(id: number): Observable<any> {
    return this.http.get(`${this.apiUri}/category/${id}`);
  }
}

