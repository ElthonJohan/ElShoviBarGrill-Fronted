import { MenuItem } from './menuitem';
import { Order } from './order';

export class OrderItem {
  id!: number;
  menuItem!: MenuItem;
  quantity!: number;
  unitPrice!: number;
  order!: Order;
}