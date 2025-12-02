import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';
import { Subject } from 'rxjs';
import { User } from '../model/user';


@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericService<User> {

  private uri: string;
  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    super(http, `${apiUrl}/users`);
    this.uri = `${apiUrl}`;
  }
  getRoles(){
    return this.http.get<any>(`${this.uri}/roles`);
  }

  updateProfile(id: number, dto: any) {
  return this.http.put(`${this.uri}/profile/${id}`, dto);
}

}
