import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';
import { Subject } from 'rxjs';

export interface User {
  idUser: number;
  username: string;
  password?: string;
  fullName: string;
  email: string;
  roleId: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericService<User> {

  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    super(http, `${apiUrl}/users`);
  }

}
