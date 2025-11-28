import { Table } from './table';
import { User } from './user';

export class Reservation {
  idReservation!: number;
  idUser!: number ;
  idTable!: number ;
  reservationDate!: string; 
  reservationTimeStart!: string;
  reservationTimeEnd!: string;

  status!: string;

  userName!:string;
  tableNumber!:number;
}