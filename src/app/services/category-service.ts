import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Category {
  idCategory: number;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends GenericService<Category> {

  private categoryChange = new BehaviorSubject<Category[]>([]);
  private messageChange = new BehaviorSubject<string>('');

  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    super(http, `${environment.HOST}/categories`);
  }

  getCategoryChange() {
    return this.categoryChange.asObservable();
  }

  setCategoryChange(data: Category[]) {
    this.categoryChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

  setMessageChange(msg: string) {
    this.messageChange.next(msg);
  }
}
