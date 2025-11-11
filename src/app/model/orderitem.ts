import { MenuItem } from './menuitem';
import { Order } from './order';

export class OrderItem {
  idOrderItem!: number;
  menuItem!: MenuItem;
  quantity!: number;
  unitPrice!: number;
  order!: Order;
}