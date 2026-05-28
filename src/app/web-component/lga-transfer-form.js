import { LitElement, html, css } from 'lit-element';

class LgaTransferForm extends LitElement {
  static get properties() {
    return {
      iban:       { type: String },
      balance:    { type: Number },
      _amount:    { type: Number,  attribute: false },
      _immediate: { type: Boolean, attribute: false },
      _error:     { type: String,  attribute: false },
    };
  }

  constructor() {
    super();
    this._amount    = null;
    this._immediate = false;
    this._error     = '';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
      }

      .form {
        background: #FFFFFF;
        border-radius: 12px;
        margin: 0 16px 12px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
        overflow: hidden;
      }

      .origin-section {
        padding: 14px 16px;
        border-bottom: 0.5px solid rgba(60, 60, 67, 0.12);
      }

      .section-label {
        font-size: 0.68rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #8E8E93;
        margin-bottom: 4px;
      }

      .iban-text {
        font-family: 'SF Mono', 'Fira Code', monospace;
        font-size: 0.82rem;
        color: #3C3C43;
        letter-spacing: 1px;
      }

      .amount-section {
        padding: 16px 16px 14px;
        border-bottom: 0.5px solid rgba(60, 60, 67, 0.12);
      }

      .amount-row {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }

      .currency-symbol {
        font-size: 1.6rem;
        font-weight: 300;
        color: #3C3C43;
        line-height: 1;
      }

      .amount-input {
        all: unset;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
        font-size: 2.2rem;
        font-weight: 300;
        color: #1C1C1E;
        letter-spacing: -1px;
        width: 100%;
        line-height: 1;
        caret-color: #007AFF;
      }

      .amount-input::placeholder { color: #C7C7CC; }
      .amount-input.has-error    { color: #FF3B30; }

      .error-msg {
        font-size: 0.76rem;
        color: #FF3B30;
        margin-top: 6px;
      }

      .hint {
        font-size: 0.74rem;
        color: #8E8E93;
        margin-top: 5px;
      }

      .type-section { padding: 0; }

      .type-option {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 13px 16px;
        cursor: pointer;
        border-bottom: 0.5px solid rgba(60, 60, 67, 0.12);
        transition: background 0.12s;
        user-select: none;
        -webkit-user-select: none;
      }
      .type-option:last-child { border-bottom: none; }
      .type-option:active     { background: #F2F2F7; }

      .type-option input[type="checkbox"] {
        width: 20px;
        height: 20px;
        border-radius: 6px;
        accent-color: #007AFF;
        cursor: pointer;
        flex-shrink: 0;
      }

      .option-texts {
        display: flex;
        flex-direction: column;
        gap: 1px;
        flex: 1;
      }

      .option-title {
        font-size: 0.88rem;
        font-weight: 500;
        color: #1C1C1E;
      }

      .option-desc {
        font-size: 0.75rem;
        color: #8E8E93;
      }

      .option-check {
        color: #007AFF;
        font-size: 1rem;
        font-weight: 600;
        opacity: 0;
        transition: opacity 0.15s;
      }
      .type-option.selected .option-check { opacity: 1; }

      .submit-btn {
        display: block;
        width: calc(100% - 32px);
        margin: 12px 16px 16px;
        padding: 14px;
        background: #007AFF;
        color: #fff;
        border: none;
        border-radius: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
        font-size: 0.95rem;
        font-weight: 600;
        letter-spacing: -0.1px;
        cursor: pointer;
        transition: background 0.15s, transform 0.1s;
      }
      .submit-btn:hover  { background: #0071E3; }
      .submit-btn:active { background: #0051D5; transform: scale(0.98); }
    `;
  }

  _onAmountInput(e) {
    const raw = e.target.value;
    this._amount = raw === '' ? null : parseFloat(raw);
    this._error  = '';
  }

  _onImmediateChange(e) {
    this._immediate = e.target.checked;
  }

  _onSubmit(e) {
    e.preventDefault();

    if (!this._amount || this._amount <= 0) {
      this._error = 'El importe debe ser mayor de 0 €';
      return;
    }
    if (this.balance !== undefined && this._amount > this.balance) {
      this._error = 'El importe supera el saldo disponible';
      return;
    }

    this.dispatchEvent(new CustomEvent('lga-transfer-submit', {
      detail: { amount: this._amount, type: this._immediate ? 'inmediata' : 'normal' },
      bubbles: true, composed: true,
    }));

    this._amount    = null;
    this._immediate = false;
    this._error     = '';
  }

  _formatIban(iban) {
    return (iban || '').replace(/(.{4})/g, '$1 ').trim();
  }

  _formatBalance(balance) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })
      .format(balance ?? 0);
  }

  render() {
    return html`
      <form @submit="${this._onSubmit}">
        <div class="form">

          <div class="origin-section">
            <p class="section-label">Desde</p>
            <p class="iban-text">${this._formatIban(this.iban)}</p>
          </div>

          <div class="amount-section">
            <p class="section-label">Importe</p>
            <div class="amount-row">
              <span class="currency-symbol">€</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0"
                class="amount-input ${this._error ? 'has-error' : ''}"
                .value="${this._amount != null ? this._amount : ''}"
                @input="${this._onAmountInput}"
              />
            </div>
            ${this._error
              ? html`<p class="error-msg">⚠ ${this._error}</p>`
              : html`<p class="hint">Disponible: ${this._formatBalance(this.balance)}</p>`
            }
          </div>

          <div class="type-section">
            <label class="type-option ${this._immediate ? 'selected' : ''}">
              <input
                type="checkbox"
                ?checked="${this._immediate}"
                @change="${this._onImmediateChange}"
              />
              <div class="option-texts">
                <span class="option-title">Inmediata</span>
                <span class="option-desc">Llega en segundos, disponible 24/7</span>
              </div>
              <span class="option-check">✓</span>
            </label>

            <div class="type-option ${!this._immediate ? 'selected' : ''}" style="cursor:default">
              <div style="width:20px;height:20px;flex-shrink:0"></div>
              <div class="option-texts">
                <span class="option-title" style="color: ${!this._immediate ? '#1C1C1E' : '#8E8E93'}">
                  Normal
                </span>
                <span class="option-desc">24–48 h laborables</span>
              </div>
              <span class="option-check" style="opacity:${!this._immediate ? 1 : 0}">✓</span>
            </div>
          </div>

        </div>

        <button type="submit" class="submit-btn">Enviar transferencia</button>
      </form>
    `;
  }
}

customElements.define('lga-transfer-form', LgaTransferForm);
