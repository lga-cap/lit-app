/**
 * lga-card.js
 * Tarjeta contenedora genérica.
 *
 * INPUT:  title / subtitle / badge / clickable
 * OUTPUT: card-click → CustomEvent { title }
 */
import { LitElement, html, css } from 'lit-element';

class LgaCard extends LitElement {

  static get properties() {
    return {
      title:     { type: String },
      subtitle:  { type: String },
      badge:     { type: String },
      clickable: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.clickable = false;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
      }

      .card {
        background: #FFFFFF;
        border-radius: 12px;
        padding: 16px;
        margin: 0 16px 12px;
        /* Sombra sutil */
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      :host([clickable]) .card { cursor: pointer; }
      :host([clickable]) .card:active {
        transform: scale(0.985);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .card-title {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 600;
        color: #1C1C1E;
        letter-spacing: -0.2px;
      }

      .card-subtitle {
        margin: 3px 0 0;
        font-size: 0.8rem;
        color: #8E8E93;
        font-weight: 400;
      }

      .badge {
        background: #EBF5FF;
        color: #007AFF;
        font-size: 0.65rem;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        white-space: nowrap;
        margin-left: 8px;
      }

      /* Flecha de navegación para items clickables */
      :host([clickable]) .card-header::after {
        content: '›';
        font-size: 1.2rem;
        color: #C7C7CC;
        line-height: 1;
        margin-left: 6px;
        align-self: center;
        flex-shrink: 0;
      }

      /* Separador entre header y slot content */
      ::slotted(*:first-child) {
        margin-top: 12px;
      }
    `;
  }

  _handleClick() {
    if (!this.clickable) return;
    this.dispatchEvent(new CustomEvent('card-click', {
      detail: { title: this.title },
      bubbles: true, composed: true,
    }));
  }

  render() {
    return html`
      <div class="card" @click="${this._handleClick}">
        <div class="card-header">
          <div>
            <h3 class="card-title">${this.title}</h3>
            ${this.subtitle ? html`<p class="card-subtitle">${this.subtitle}</p>` : ''}
          </div>
          ${this.badge ? html`<span class="badge">${this.badge}</span>` : ''}
        </div>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('lga-card', LgaCard);
