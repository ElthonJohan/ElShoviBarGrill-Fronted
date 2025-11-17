import { Table } from './table';
import { User } from './user';

export class Reservation {
  idReservation!: number;
  idTable!: number;
  idUser!: number;
  reservationDate!: string; 
  reservationTime!: string; 
  status!: string;
}