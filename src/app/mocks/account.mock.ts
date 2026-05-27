/**
 * account.mock.ts
 * Datos de prueba para desarrollo y tests.
 * En producción el AccountService los sustituye por llamadas HTTP reales.
 */

import { Account, Movement, Product } from '../models/account.model';

export const MOCK_ACCOUNT: Account = {
  owner:   'Luis García',
  iban:    'ES1234567890123456789012',
  balance: 3_580.40,
  type:    'Cuenta Corriente',
};

export const MOCK_MOVEMENTS: Movement[] = [
  { id: 1, description: 'Nómina Mayo',            amount:  2_100.00, date: '23 may 2026' },
  { id: 2, description: 'Supermercado Mercadona',  amount:    -85.30, date: '24 may 2026' },
  { id: 3, description: 'Netflix',                 amount:    -17.99, date: '22 may 2026' },
  { id: 4, description: 'Restaurante El Rincón',   amount:    -42.50, date: '21 may 2026' },
  { id: 5, description: 'Gasolinera Repsol',       amount:    -60.00, date: '20 may 2026' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'credit-card', name: 'Tarjeta Arko',     description: 'Sin comisiones el primer año', badge: 'Nuevo' },
  { id: 'insurance',   name: 'Seguro Hogar',      description: 'Protege lo que más importa' },
  { id: 'loan',        name: 'Préstamo Personal', description: 'Hasta 60.000 € en 24 horas' },
];
