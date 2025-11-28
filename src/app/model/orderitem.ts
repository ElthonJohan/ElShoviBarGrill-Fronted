import { MenuItem } from './menuitem';
import type { Order } from './order';

export class OrderItem {
  idOrderItem?: number;
  idMenuItem!: number;
  quantity!: number;
  unitPrice!: number;
}