import { LitElement, html, css } from "lit-element";

class LgaTabs extends LitElement {
  static get properties() {
    return {
      tabs:      { type: Array },
      activeTab: { type: String, attribute: "active-tab" },
    };
  }

  constructor() {
    super();
    this.tabs = [];
    this.activeTab = "";
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
      }

      .sc-wrapper {
        padding: 10px 16px 14px;
        background: #f2f2f7;
      }

      nav {
        display: flex;
        background: rgba(116, 116, 128, 0.12);
        border-radius: 10px;
        padding: 2px;
      }

      .tab {
        all: initial;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
        flex: 1;
        text-align: center;
        padding: 7px 6px;
        border-radius: 8px;
        font-size: 0.75rem;
        font-weight: 500;
        color: rgba(60, 60, 67, 0.6);
        cursor: pointer;
        line-height: 1.2;
        letter-spacing: -0.1px;
        transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
        -webkit-user-select: none;
      }

      .tab:hover { color: rgba(60, 60, 67, 0.85); }

      .tab.active {
        background: #ffffff;
        color: #1c1c1e;
        font-weight: 600;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
      }

      .tab:focus-visible {
        outline: 2px solid #007aff;
        outline-offset: -2px;
      }
    `;
  }

  _select(tabId) {
    if (this.activeTab === tabId) return;
    this.activeTab = tabId;
    this.dispatchEvent(
      new CustomEvent("tab-change", {
        detail: { tabId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <div class="sc-wrapper">
        <nav role="tablist" aria-label="Navegación principal">
          ${(this.tabs || []).map(
            (tab) => html`
              <button
                role="tab"
                aria-selected="${this.activeTab === tab.id}"
                class="tab ${this.activeTab === tab.id ? "active" : ""}"
                @click="${() => this._select(tab.id)}"
              >
                ${tab.label}
              </button>
            `,
          )}
        </nav>
      </div>
    `;
  }
}

customElements.define("lga-tabs", LgaTabs);
