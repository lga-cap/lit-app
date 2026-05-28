import { LitElement, html, css } from 'lit-element';

const FLOWS = {
  start: {
    text: '¡Hola! Soy el asistente de LGA. ¿En qué puedo ayudarte?',
    options: [
      { id: 'que-es', label: '¿Qué es LGA?' },
      { id: 'transferencia', label: '¿Cómo hago una transferencia?' },
      { id: 'productos', label: '¿Qué productos hay?' },
      { id: 'contacto', label: 'Contactar con soporte' },
    ],
  },
  'que-es': {
    text: 'LGA es tu banca digital. Consulta tu cuenta, revisa movimientos, realiza transferencias y explora productos financieros, todo desde aquí.',
    options: [
      { id: 'transferencia', label: '¿Cómo hago una transferencia?' },
      { id: 'start', label: '↩ Volver al inicio' },
    ],
  },
  transferencia: {
    text: 'Abre la pestaña "Transferir", introduce el importe y elige el tipo. Pulsa "Enviar transferencia" y recibirás confirmación al instante.',
    options: [
      { id: 'diferencia', label: '¿Inmediata vs Normal?' },
      { id: 'start', label: '↩ Volver al inicio' },
    ],
  },
  diferencia: {
    text: 'La transferencia inmediata llega en segundos (disponible 24/7). La normal tarda 24–48 h laborables y puede tener menor coste.',
    options: [
      { id: 'start', label: '↩ Volver al inicio' },
    ],
  },
  productos: {
    text: 'En "Productos" encontrarás tarjetas de crédito, seguros y préstamos. Pulsa sobre cualquiera para obtener más información.',
    options: [
      { id: 'start', label: '↩ Volver al inicio' },
    ],
  },
  contacto: {
    text: 'Llámanos al 900 123 456 (lunes a viernes, 8:00–22:00) o escríbenos a soporte@lga.es. Te atenderemos lo antes posible.',
    options: [
      { id: 'start', label: '↩ Volver al inicio' },
    ],
  },
};

class LgaChatbot extends LitElement {
  static get properties() {
    return {
      _open:     { type: Boolean, attribute: false },
      _messages: { type: Array,   attribute: false },
      _options:  { type: Array,   attribute: false },
    };
  }

  constructor() {
    super();
    this._open = false;
    this._messages = [];
    this._options = [];
  }

  static get styles() {
    return css`
      :host {
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
      }

      /* ── Botón flotante ── */
      .fab {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #007AFF;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(0, 122, 255, 0.4);
        z-index: 10000;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .fab:hover  { transform: scale(1.07); box-shadow: 0 6px 20px rgba(0, 122, 255, 0.5); }
      .fab:active { transform: scale(0.95); }

      .fab svg { width: 26px; height: 26px; fill: #fff; }

      /* ── Panel de chat ── */
      .panel {
        position: fixed;
        bottom: 92px;
        right: 16px;
        width: 320px;
        max-height: 460px;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
        display: flex;
        flex-direction: column;
        z-index: 9999;
        overflow: hidden;
        transform-origin: bottom right;
        transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .panel.hidden {
        opacity: 0;
        transform: scale(0.85) translateY(12px);
        pointer-events: none;
      }

      /* Cabecera */
      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        background: #007AFF;
        color: #fff;
        flex-shrink: 0;
      }
      .panel-title {
        font-size: 0.9rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .panel-title span { font-size: 1rem; }
      .close-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        color: #fff;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1rem;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s;
      }
      .close-btn:hover { background: rgba(255,255,255,0.35); }

      /* Mensajes */
      .messages {
        flex: 1;
        overflow-y: auto;
        padding: 14px 12px 8px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        scroll-behavior: smooth;
      }

      .msg {
        max-width: 82%;
        padding: 9px 12px;
        border-radius: 14px;
        font-size: 0.83rem;
        line-height: 1.45;
      }
      .msg.bot {
        background: #F2F2F7;
        color: #1C1C1E;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
      }
      .msg.user {
        background: #007AFF;
        color: #fff;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
      }

      /* Opciones */
      .options {
        padding: 8px 12px 14px;
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        flex-shrink: 0;
        border-top: 0.5px solid rgba(60,60,67,0.12);
      }
      .opt-btn {
        background: #EBF5FF;
        color: #007AFF;
        border: 1px solid rgba(0, 122, 255, 0.25);
        border-radius: 20px;
        padding: 6px 13px;
        font-size: 0.78rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.12s, transform 0.1s;
        font-family: inherit;
      }
      .opt-btn:hover  { background: #D6ECFF; }
      .opt-btn:active { transform: scale(0.96); }
    `;
  }

  _toggle() {
    this._open = !this._open;
    if (this._open && this._messages.length === 0) {
      this._goTo('start');
    }
  }

  _close() {
    this._open = false;
  }

  _selectOption(option) {
    this._messages = [...this._messages, { from: 'user', text: option.label }];
    this._options = [];

    // Simula un pequeño delay de respuesta
    setTimeout(() => {
      const flow = FLOWS[option.id];
      if (flow) {
        this._messages = [...this._messages, { from: 'bot', text: flow.text }];
        this._options = flow.options;
      }
      this._scrollToBottom();
    }, 300);
  }

  _goTo(flowId) {
    const flow = FLOWS[flowId];
    if (!flow) return;
    this._messages = [{ from: 'bot', text: flow.text }];
    this._options = flow.options;
  }

  _scrollToBottom() {
    const el = this.shadowRoot?.querySelector('.messages');
    if (el) el.scrollTop = el.scrollHeight;
  }

  render() {
    return html`
      <button class="fab" @click="${this._toggle}" aria-label="Abrir asistente">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
        </svg>
      </button>

      <div class="panel ${this._open ? '' : 'hidden'}">
        <div class="panel-header">
          <div class="panel-title">
            <span>💬</span> Asistente LGA
          </div>
          <button class="close-btn" @click="${this._close}" aria-label="Cerrar">✕</button>
        </div>

        <div class="messages">
          ${this._messages.map(m => html`
            <div class="msg ${m.from}">${m.text}</div>
          `)}
        </div>

        <div class="options">
          ${this._options.map(opt => html`
            <button class="opt-btn" @click="${() => this._selectOption(opt)}">
              ${opt.label}
            </button>
          `)}
        </div>
      </div>
    `;
  }
}

customElements.define('lga-chatbot', LgaChatbot);
