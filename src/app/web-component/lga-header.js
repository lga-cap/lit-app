import { LitElement, html, css } from "lit-element";

class LgaHeader extends LitElement {
  static get properties() {
    return {
      username: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
        position: sticky;
        top: 0;
        z-index: 100;
      }

      header {
        background: rgba(242, 242, 247, 0.85);
        backdrop-filter: saturate(180%) blur(20px);
        -webkit-backdrop-filter: saturate(180%) blur(20px);
        border-bottom: 0.5px solid rgba(60, 60, 67, 0.2);
        padding: 13px 20px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo {
        font-size: 1.15rem;
        font-weight: 700;
        color: #007aff;
        letter-spacing: 2px;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
      }

      .greeting {
        font-size: 0.82rem;
        font-weight: 400;
        color: #8e8e93;
        letter-spacing: -0.1px;
      }
    `;
  }

  render() {
    return html`
      <header>
        <span class="logo">LGA</span>
        <span class="greeting">Hola, ${this.username}</span>
      </header>
    `;
  }
}

customElements.define("lga-header", LgaHeader);
