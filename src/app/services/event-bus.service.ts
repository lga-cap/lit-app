/**
 * event-bus.service.ts
 *
 * Bus de eventos global (patrón Publish/Subscribe).
 *
 * ¿Por qué existe si ya tenemos Custom DOM Events?
 * ────────────────────────────────────────────────
 * Los Custom DOM Events (con bubbles + composed) requieren que los componentes
 * estén relacionados en el árbol DOM (padre → hijo → nieto…).
 * El evento sube ("burbujea") hasta encontrar un listener.
 *
 * El EventBus es la alternativa para componentes NO relacionados en el DOM:
 *  - Dos micro-frontends en zonas distintas de la página
 *  - Un componente de notificación que necesita saber lo que pasa en otro árbol
 *  - Comunicación entre la shell y los micro-apps en arquitecturas Cells/BBVA
 *
 * Comparativa rápida:
 * ┌──────────────────────┬─────────────────────┬──────────────────────────┐
 * │                      │  Custom DOM Events  │       EventBus           │
 * ├──────────────────────┼─────────────────────┼──────────────────────────┤
 * │ Relación DOM         │ Requiere padre/hijo │ No requiere              │
 * │ Acoplamiento         │ Bajo (web standard) │ Muy bajo (desacoplado)   │
 * │ Depuración           │ DevTools Network    │ Logs manuales            │
 * │ Uso en Cells/BBVA    │ Comunicación local  │ Comunicación global/shell│
 * └──────────────────────┴─────────────────────┴──────────────────────────┘
 *
 * Estructura del evento inspirada en CloudEvents (https://cloudevents.io/),
 * el estándar que usa BBVA en su arquitectura de microfrontends para
 * garantizar un formato consistente entre equipos.
 */

import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

/** Estructura de evento (inspirada en CloudEvents spec) */
export interface AppEvent<T = unknown> {
  /** Tipo del evento, con namespace para evitar colisiones entre equipos */
  type: string;       // ej: 'bbva.account.transfer.requested'

  /** Web component o servicio que lo originó */
  source?: string;    // ej: 'bbva-account-card'

  /** Carga de datos del evento */
  payload?: T;
}

@Injectable({ providedIn: 'root' })
export class EventBusService implements OnDestroy {

  // Subject privado: solo el servicio puede emitir
  private readonly bus$ = new Subject<AppEvent>();

  /**
   * Publica un evento en el bus.
   * Cualquier parte de la app puede llamar a emit() sin saber quién escucha.
   */
  emit<T>(event: AppEvent<T>): void {
    this.bus$.next(event);
  }

  /**
   * Suscripción filtrada por tipo de evento.
   * Devuelve un Observable para que el consumidor gestione su ciclo de vida
   * (unsubscribe en ngOnDestroy, async pipe, etc.)
   *
   * Uso:
   *   this.eventBus.on('bbva.account.transfer.requested')
   *     .subscribe(event => console.log(event.payload));
   */
  on<T = unknown>(eventType: string): Observable<AppEvent<T>> {
    return this.bus$.asObservable().pipe(
      filter((event): event is AppEvent<T> => event.type === eventType),
    );
  }

  ngOnDestroy(): void {
    // Completamos el Subject para liberar memoria cuando se destruye el servicio
    this.bus$.complete();
  }
}
