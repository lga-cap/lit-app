import { LitElement, html, css } from 'lit-element';

class LgaMovementItem extends LitElement {
  static get properties() {
    return {
      description: { type: String },
      amount:      { type: Number },
      date:        { type: String },
    };
  }

  static get styles() {
    return css`
      :host { display: block; }
      :host(:last-child) .row { border-bottom: none; }

      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 11px 16px;
        border-bottom: 0.5px solid rgba(60, 60, 67, 0.12);
        transition: background 0.12s;
      }
      .row:active { background: #F2F2F7; }

      .info { display: flex; flex-direction: column; gap: 2px; }

      .description {
        font-size: 0.88rem;
        color: #1C1C1E;
        font-weight: 500;
        letter-spacing: -0.1px;
      }

      .date {
        font-size: 0.72rem;
        color: #8E8E93;
      }

      .amount {
        font-size: 0.9rem;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.3px;
      }

      .amount.income  { color: #34C759; }
      .amount.expense { color: #1C1C1E; }
    `;
  }

  _formatAmount(amount) {
    const sign = amount > 0 ? '+' : '';
    return sign + new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })
      .format(amount);
  }

  render() {
    const isIncome = this.amount > 0;
    return html`
      <div class="row">
        <div class="info">
          <span class="description">${this.description}</span>
          <span class="date">${this.date}</span>
        </div>
        <span class="amount ${isIncome ? 'income' : 'expense'}">
          ${this._formatAmount(this.amount)}
        </span>
      </div>
    `;
  }
}

customElements.define('lga-movement-item', LgaMovementItem);
