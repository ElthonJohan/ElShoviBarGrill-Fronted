export enum OrderStatus {
  COMPLETADA = 'COMPLETADA',
  PENDIENTE = 'PENDIENTE',
  EN_PREPARACION = 'EN_PREPARACION',
  LISTO = 'LISTO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO'
}

//COMPLETADA,PENDIENTE,EN_PREPARACION,LISTO,ENTREGADO,CANCELADO

// Mapeo de labels
export const OrderStatusLabels: Record<OrderStatus , string> = {
  [OrderStatus.COMPLETADA]: 'Completada',
  [OrderStatus.PENDIENTE]: 'Pendiente',
  [OrderStatus.EN_PREPARACION]: 'En preparación',
  [OrderStatus.LISTO]: 'Listo',
  [OrderStatus.ENTREGADO]: 'Entregado',
  [OrderStatus.CANCELADO]: 'Cancelado'
};

// Si quieres un array como el original:
export const orderStatus = Object.entries(OrderStatusLabels).map(([value, label]) => ({
  value,
  label
}));