export enum DeliveryStatus {
  PENDIENTE = 'PENDIENTE',
  EN_CAMINO = 'EN_CAMINO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO'
}

// Mapeo de labels
export const DeliveryStatusLabels: Record<DeliveryStatus , string> = {
  [DeliveryStatus.PENDIENTE]: 'Pendiente',
  [DeliveryStatus.EN_CAMINO]: 'En camino',
  [DeliveryStatus.ENTREGADO]: 'Entregado',
  [DeliveryStatus.CANCELADO]: 'Cancelado'
};

// Si quieres un array como el original:
export const deliveryStatus = Object.entries(DeliveryStatusLabels).map(([value, label]) => ({
  value,
  label
}));