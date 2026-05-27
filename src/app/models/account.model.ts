/**
 * account.model.ts
 * Interfaces de dominio para los datos de cuenta y movimientos.
 * Solo tipos puros: sin lógica, sin datos, sin dependencias.
 */

export interface Account {
  owner:   string;
  iban:    string;
  balance: number;
  type:    string;
}

export interface Movement {
  id:          number;
  description: string;
  amount:      number;
  date:        string;
}

export interface Product {
  id:          string;
  name:        string;
  description: string;
  badge?:      string;
}
