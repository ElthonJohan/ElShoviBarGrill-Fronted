import { User } from './user';
import { Table } from './table';
import { OrderItem } from './orderitem';
import { Payment } from './payment';
import { OrderType } from './enums/ordertype';
import { OrderStatus } from './enums/orderstatus';

export class Order {
  id!: number;
  user!: User;
  table!: Table;
  orderType!: OrderType;
  status!: OrderStatus;
  totalAmount!: number;
  notes!: string;
  createdAt!: string;
  items!: OrderItem[];
  payment!: Payment;
}