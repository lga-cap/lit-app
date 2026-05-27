/**
 * lga-account-card.js
 * Tarjeta de cuenta bancaria.
 *
 * INPUT: iban / balance / accountType (account-type)
 */
import { LitElement, html, css } from 'lit-element';

class LgaAccountCard extends LitElement {

  static get properties() {
    return {
      iban:        { type: String },
      balance:     { type: Number },
      accountType: { type: String, attribute: 'account-type' },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
      }

      .card {
        background: linear-gradient(145deg, #1C1C1E 0%, #2C2C2E 60%, #1a1a2e 100%);
        border-radius: 20px;
        padding: 24px 22px 22px;
        margin: 14px 16px;
        color: #fff;
        /* Sombra en capas: distancia + difusa */
        box-shadow:
          0 2px 8px  rgba(0, 0, 0, 0.18),
          0 8px 24px rgba(0, 0, 0, 0.12);
        position: relative;
        overflow: hidden;
      }

      /* Círculos decorativos de fondo */
      .card::before,
      .card::after {
        content: '';
        position: absolute;
        border-radius: 50%;
        opacity: 0.06;
        background: #fff;
      }
      .card::before {
        width: 200px; height: 200px;
        top: -60px; right: -40px;
      }
      .card::after {
        width: 140px; height: 140px;
        bottom: -50px; left: -30px;
      }

      .account-type {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 2.5px;
        opacity: 0.55;
        margin: 0 0 10px;
        font-weight: 500;
      }

      .iban {
        font-size: 0.78rem;
        font-family: 'SF Mono', 'Fira Code', monospace;
        opacity: 0.65;
        margin: 0 0 28px;
        letter-spacing: 1.5px;
      }

      .balance-label {
        font-size: 0.7rem;
        opacity: 0.55;
        margin: 0 0 3px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .balance {
        font-size: 2.4rem;
        font-weight: 700;
        margin: 0;
        letter-spacing: -1.5px;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
      }
    `;
  }

  _formatIban(iban) {
    if (!iban) return '';
    // Enmascara el IBAN mostrando solo inicio y final
    const masked = iban.slice(0, 4) + ' •••• •••• ' + iban.slice(-4);
    return masked;
  }

  _formatBalance(balance) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })
      .format(balance ?? 0);
  }

  render() {
    return html`
      <div class="card">
        <p class="account-type">${this.accountType || 'Cuenta'}</p>
        <p class="iban">${this._formatIban(this.iban)}</p>
        <p class="balance-label">Saldo disponible</p>
        <p class="balance">${this._formatBalance(this.balance)}</p>
      </div>
    `;
  }
}

customElements.define('lga-account-card', LgaAccountCard);
