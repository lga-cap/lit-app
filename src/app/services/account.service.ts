/**
 * account.service.ts
 * Responsabilidad única: obtener datos de cuenta.
 * Tipos → models/  |  Datos mock → mocks/
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Account, Movement, Product } from '../models/account.model';
import { MOCK_ACCOUNT, MOCK_MOVEMENTS, MOCK_PRODUCTS } from '../mocks/account.mock';

@Injectable({ providedIn: 'root' })
export class AccountService {

  /** En producción: return this.http.get<Account>('/api/v1/account/me') */
  getAccount(): Observable<Account> {
    return of(MOCK_ACCOUNT).pipe(delay(300));
  }

  getMovements(): Observable<Movement[]> {
    return of(MOCK_MOVEMENTS).pipe(delay(300));
  }

  getProducts(): Observable<Product[]> {
    return of(MOCK_PRODUCTS).pipe(delay(300));
  }
}
