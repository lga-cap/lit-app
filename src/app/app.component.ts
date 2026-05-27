/**
 * app.component.ts — Shell LGA
 *
 * Todos los web components se crean programáticamente (ngAfterViewInit).
 * El template Angular es solo el punto de anclaje.
 */

import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewEncapsulation,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { AccountService } from './services/account.service';
import { EventBusService } from './services/event-bus.service';
import { Account, Movement, Product } from './models/account.model';
import { Transfer, TransferType } from './models/transfer.model';

// Registro de Custom Elements
import './web-component/lga-header';
import './web-component/lga-tabs';
import './web-component/lga-card';
import './web-component/lga-account-card';
import './web-component/lga-movement-item';
import './web-component/lga-transfer-form';
import './web-component/lga-transfer-list';

const TABS = [
  { id: 'cuenta', label: 'Cuenta' },
  { id: 'movimientos', label: 'Movimientos' },
  { id: 'transferencias', label: 'Transferir' },
  { id: 'productos', label: 'Productos' },
];

@Component({
  selector: 'app-root',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('app') private appRef!: ElementRef<HTMLDivElement>;
  @ViewChild('notification')
  private notificationRef!: ElementRef<HTMLDivElement>;

  private account!: Account;
  private movements!: Movement[];
  private products!: Product[];
  private transfers: Transfer[] = [];
  private tabContentEl!: HTMLElement;

  private subs = new Subscription();
  private notifTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private accountService: AccountService,
    private eventBus: EventBusService,
  ) {}

  ngAfterViewInit(): void {
    this.subs.add(
      combineLatest([
        this.accountService.getAccount(),
        this.accountService.getMovements(),
        this.accountService.getProducts(),
      ]).subscribe(([account, movements, products]) => {
        this.account = account;
        this.movements = movements;
        this.products = products;
        this.buildUI();
      }),
    );

    this.subs.add(
      this.eventBus
        .on<Transfer>('lga.transfer.submitted')
        .subscribe((e) =>
          this.showNotification(
            `✅ ${this._fmt(e.payload!.amount)} enviados (${e.payload!.type})`,
          ),
        ),
    );

    this.subs.add(
      this.eventBus
        .on<{ title: string }>('lga.product.selected')
        .subscribe((e) => this.showNotification(`ℹ️ ${e.payload?.title}`)),
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // CONSTRUCCIÓN PROGRAMÁTICA DE LA UI
  // ─────────────────────────────────────────────────────────────────

  private buildUI(): void {
    const root = this.appRef.nativeElement;
    root.innerHTML = '';

    const header = document.createElement('lga-header');
    (header as any).username = this.account.owner;
    root.appendChild(header);

    const main = document.createElement('main');
    main.className = 'dashboard';
    root.appendChild(main);

    const tabs = document.createElement('lga-tabs');
    (tabs as any).tabs = TABS;
    (tabs as any).activeTab = TABS[0].id;
    main.appendChild(tabs);

    this.tabContentEl = document.createElement('div');
    this.tabContentEl.className = 'tab-content';
    main.appendChild(this.tabContentEl);

    tabs.addEventListener('tab-change', (e: Event) => {
      const { tabId } = (e as CustomEvent<{ tabId: string }>).detail;
      (tabs as any).activeTab = tabId;
      this.eventBus.emit({
        type: 'lga.navigation.tab-changed',
        payload: { tabId },
      });
      this.renderTab(tabId);
    });

    this.renderTab(TABS[0].id);
  }

  // ─────────────────────────────────────────────────────────────────
  // RENDERIZADO DE TABS
  // ─────────────────────────────────────────────────────────────────

  private renderTab(tabId: string): void {
    this.tabContentEl.innerHTML = '';
    if (tabId === 'cuenta') this.renderCuentaTab();
    if (tabId === 'movimientos') this.renderMovimientosTab();
    if (tabId === 'transferencias') this.renderTransferenciasTab();
    if (tabId === 'productos') this.renderProductosTab();
  }

  private renderCuentaTab(): void {
    const card = document.createElement('lga-account-card');
    (card as any).iban = this.account.iban;
    (card as any).balance = this.account.balance;
    (card as any).accountType = this.account.type;
    this.tabContentEl.appendChild(card);
  }

  private renderMovimientosTab(): void {
    const wrapper = document.createElement('lga-card');
    (wrapper as any).title = 'Últimos movimientos';
    for (const m of this.movements) {
      const item = document.createElement('lga-movement-item');
      (item as any).description = m.description;
      (item as any).amount = m.amount;
      (item as any).date = m.date;
      wrapper.appendChild(item);
    }
    this.tabContentEl.appendChild(wrapper);
  }

  private renderTransferenciasTab(): void {
    const form = document.createElement('lga-transfer-form');
    (form as any).iban = this.account.iban;
    (form as any).balance = this.account.balance;

    const list = document.createElement('lga-transfer-list');
    (list as any).transfers = [...this.transfers];

    form.addEventListener('lga-transfer-submit', (e: Event) => {
      const { amount, type } = (
        e as CustomEvent<{ amount: number; type: TransferType }>
      ).detail;

      const transfer: Transfer = {
        id: Math.random().toString(36).slice(2, 9),
        amount,
        type,
        date: new Date().toLocaleString('es-ES', {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
      };

      this.transfers = [...this.transfers, transfer];
      (list as any).transfers = [...this.transfers];

      this.eventBus.emit({
        type: 'lga.transfer.submitted',
        source: 'lga-transfer-form',
        payload: transfer,
      });
    });

    this.tabContentEl.appendChild(form);
    this.tabContentEl.appendChild(list);
  }

  private renderProductosTab(): void {
    for (const p of this.products) {
      const card = document.createElement('lga-card');
      (card as any).title = p.name;
      (card as any).subtitle = p.description;
      (card as any).clickable = true;
      if (p.badge) (card as any).badge = p.badge;

      card.addEventListener('card-click', (e: Event) => {
        this.eventBus.emit({
          type: 'lga.product.selected',
          source: 'lga-card',
          payload: { ...(e as CustomEvent).detail, productId: p.id },
        });
      });

      this.tabContentEl.appendChild(card);
    }
  }

  // ─────────────────────────────────────────────────────────────────

  private showNotification(msg: string): void {
    const el = this.notificationRef.nativeElement;
    el.textContent = msg;
    el.classList.add('visible');
    if (this.notifTimer) clearTimeout(this.notifTimer);
    this.notifTimer = setTimeout(() => el.classList.remove('visible'), 3500);
  }

  private _fmt(n: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(n);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    if (this.notifTimer) clearTimeout(this.notifTimer);
  }
}
