import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface AppEvent<T = unknown> {
  type: string;
  source?: string;
  payload?: T;
}

@Injectable({ providedIn: 'root' })
export class EventBusService implements OnDestroy {
  private readonly bus$ = new Subject<AppEvent>();

  emit<T>(event: AppEvent<T>): void {
    this.bus$.next(event);
  }

  on<T = unknown>(eventType: string): Observable<AppEvent<T>> {
    return this.bus$.asObservable().pipe(
      filter((event): event is AppEvent<T> => event.type === eventType),
    );
  }

  ngOnDestroy(): void {
    this.bus$.complete();
  }
}
