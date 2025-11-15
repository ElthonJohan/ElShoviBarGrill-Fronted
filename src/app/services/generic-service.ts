import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {
  private modelChange = new Subject<T[]>();
  private messageChange = new Subject<string>();
  constructor(
    protected http: HttpClient,
    @Inject('API_URL') private url: string
  ) {}

  findAll() {
    return this.http.get<T[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  save(t: T) {
    return this.http.post(this.url, t);
  }

  update(id: number, t: T) {
    return this.http.put(`${this.url}/${id}`, t);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  
  setModelChange(t: T[]) {
    this.modelChange.next(t);
  }
  getModelChange() {
    return this.modelChange.asObservable();
  }
  setMessageChange(message: string) {
    this.messageChange.next(message);
  }
  getMessageChange() {
    return this.messageChange.asObservable();
  }
}