import { LitElement, html, css } from 'lit-element';

class LgaTransferList extends LitElement {
  static get properties() {
    return {
      transfers: { type: Array },
    };
  }

  constructor() {
    super();
    this.transfers = [];
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
      }

      .wrapper {
        background: #FFFFFF;
        border-radius: 12px;
        margin: 0 16px 12px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
        overflow: hidden;
      }

      .list-header {
        font-size: 0.68rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #8E8E93;
        padding: 12px 16px 8px;
        border-bottom: 0.5px solid rgba(60, 60, 67, 0.12);
      }

      .empty {
        padding: 28px 16px;
        text-align: center;
        color: #8E8E93;
        font-size: 0.85rem;
      }
      .empty-icon {
        font-size: 2rem;
        display: block;
        margin-bottom: 6px;
        opacity: 0.4;
      }

      ul { margin: 0; padding: 0; }

      .item {
        list-style: none;
        padding: 12px 16px;
        border-bottom: 0.5px solid rgba(60, 60, 67, 0.08);
        border-left: 3px solid transparent;
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
      .item:last-child { border-bottom: none; }

      .item.inmediata { border-left-color: #34C759; }
      .item.normal    { border-left-color: #FF9F0A; }

      .item-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
      }

      .amount {
        font-size: 0.95rem;
        font-weight: 600;
        color: #1C1C1E;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.3px;
      }

      .date {
        font-size: 0.74rem;
        color: #8E8E93;
        flex: 1;
        text-align: left;
        padding-left: 10px;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 0.68rem;
        font-weight: 700;
        padding: 3px 9px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        white-space: nowrap;
      }

      .badge.inmediata {
        background: #E8FAF0;
        color: #1A7F3C;
        border: 0.5px solid #34C75940;
      }

      .badge.normal {
        background: #FFF5E6;
        color: #B25000;
        border: 0.5px solid #FF9F0A40;
      }

      .pending-notice {
        display: flex;
        align-items: flex-start;
        gap: 7px;
        padding: 8px 10px;
        background: #FFF9EE;
        border: 0.5px solid rgba(255, 159, 10, 0.3);
        border-radius: 8px;
        font-size: 0.76rem;
        color: #7A4500;
        line-height: 1.45;
      }

      .notice-icon { flex-shrink: 0; font-size: 0.9rem; margin-top: 1px; }
    `;
  }

  _formatAmount(n) {
    return '−' + new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);
  }

  render() {
    const list = this.transfers || [];

    return html`
      <div class="wrapper">
        <p class="list-header">Historial</p>

        ${list.length === 0 ? html`
          <div class="empty">
            <span class="empty-icon">↗</span>
            No has realizado ninguna transferencia
          </div>
        ` : html`
          <ul>
            ${list.map(t => html`
              <li class="item ${t.type}">
                <div class="item-main">
                  <span class="amount">${this._formatAmount(t.amount)}</span>
                  <span class="date">${t.date}</span>
                  <span class="badge ${t.type}">
                    ${t.type === 'inmediata'
                      ? html`<span>●</span> Inmediata`
                      : html`<span>◑</span> Normal`
                    }
                  </span>
                </div>

                ${t.type === 'normal' ? html`
                  <div class="pending-notice">
                    <span class="notice-icon">⚠️</span>
                    <span>Transferencia en proceso. Cambiará de estado cuando se complete la operación (habitualmente en 24–48 h laborables).</span>
                  </div>
                ` : ''}
              </li>
            `)}
          </ul>
        `}
      </div>
    `;
  }
}

customElements.define('lga-transfer-list', LgaTransferList);
