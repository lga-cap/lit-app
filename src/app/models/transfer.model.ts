/**
 * transfer.model.ts
 * Tipos e interfaces relacionados con las transferencias bancarias.
 */

/** Modalidad de la transferencia */
export type TransferType = 'inmediata' | 'normal';

export interface Transfer {
  id:     string;         // UUID único por transferencia
  amount: number;         // Importe en euros
  type:   TransferType;   // 'inmediata' → procesada al momento | 'normal' → hasta 48h
  date:   string;         // Fecha y hora formateada para mostrar en la UI
}
