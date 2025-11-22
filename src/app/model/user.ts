
import { Role } from './role';

export class User {
  idUser!: number;
  email!: string;
  userName!: string;
  password!: string;
  fullName!: string;
  active!: boolean;
  createdAt!: string | Date;
  roles: Role[];
}
