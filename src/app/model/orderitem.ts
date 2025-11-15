import { MenuItem } from './menuitem';
import type { Order } from './order';

export class OrderItem {
  idOrderItem!: number;
  menuItem!: MenuItem;
  quantity!: number;
  unitPrice!: number;
  order!: Order;
}