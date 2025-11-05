import { Table } from './table';
import { User } from './user';

export class Reservation {
  id!: number;
  table!: Table;
  user!: User;
  reservationDate!: string; 
  reservationTime!: string; 
  status!: string;
}