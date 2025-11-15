import type { Order } from './order';
import { DeliveryStatus } from './enums/deliverystatus';

export class Delivery {
  idDelivery!: number;
  order!: Order;
  address!: string;
  phone!: string;
  driverName!: string;
  vehiclePlate!: string;
  status!: DeliveryStatus;
  deliveryTime!: string; 
}