import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';

export interface Role {
  idRole: number;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService extends GenericService<Role> {
  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    super(http, `${apiUrl}/roles`);
  }
}
