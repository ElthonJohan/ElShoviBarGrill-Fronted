import { User } from './user';
import { Table } from './table';
import type { OrderItem } from './orderitem';
import { Payment } from './payment';
import { OrderType } from './enums/ordertype';
import { OrderStatus } from './enums/orderstatus';

export class Order {
  idOrder: number;
  idUser: number;
  idTable: number;
  orderType: OrderType;
  status: OrderStatus;
  totalAmount: number;
  notes: string;
  createdAt: string;
  items: OrderItem[];
  idPayment: number;
}