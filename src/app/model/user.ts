
import { Role } from './role';

export class User {
  idUser!: number;
  email!: string;
  username!: string;
  password!: string;
  fullName!: string;
  active!: boolean;
  createdAt!: Date;
  role!: Role;
}