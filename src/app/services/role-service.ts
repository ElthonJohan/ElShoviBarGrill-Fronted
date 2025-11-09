import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';
import { Role } from '../model/role';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends GenericService<Role> {

  private roleChange = new BehaviorSubject<Role[]>([]);
  private messageChange = new BehaviorSubject<string>('');

  constructor(http: HttpClient) {
    super(http, `${environment.HOST}/roles`);
  }

  getRoleChange() {
    return this.roleChange.asObservable();
  }

  setRoleChange(data: Role[]) {
    this.roleChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

  setMessageChange(msg: string) {
    this.messageChange.next(msg);
  }
}

