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

  constructor(http: HttpClient) {
    super(http, `${environment.HOST}/roles`);
  }

}

