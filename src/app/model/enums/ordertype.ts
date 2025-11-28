export enum OrderType {
  EN_MESA = 'EN_MESA',
  DELIVERY = 'DELIVERY',
  LLEVAR='LLEVAR'
}

// Mapeo de labels
export const OrderTypeLabels: Record<OrderType, string> = {
  [OrderType.EN_MESA]: 'En mesa',
  [OrderType.DELIVERY]: 'Delivery',
  [OrderType.LLEVAR]: 'Para llevar'
};

// Si quieres un array como el original:
export const orderTypes = Object.entries(OrderTypeLabels).map(([value, label]) => ({
  value,
  label
}));