import { LitElement, html, css } from 'lit-element';
import 'dile-pages/dile-pages.js';
import './views/view-login.js';
import './views/view-home.js';
import './components/di-spinner.js';

export class PwaLitLogin extends LitElement {
  static get properties() {
    return {
      selected: { type: String },
      diffTime: { type: Number },
      email: { type: String },
    };
  }

  constructor() {
    super();
    this.selected = 'login';
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
      }

      main {
        flex-grow: 1;
      }

      view-login {
        display: flex;
      }
    `;
  }

  render() {
    return html`
      <main>
        <dile-pages selected="${this.selected}" attrforselected="name">
          <view-login
            name="login"
            @navigate-to="${this.navigateTo}"
            @last-connection="${this._getDiffTime}"
            @email="${this._setEmail}"
            @handle-spinner="${this._handleSpinner}"
          >
          </view-login>
          <view-home
            name="home"
            @navigate-to="${this.navigateTo}"
            diffTime="${this.diffTime}"
            email="${this.email}"
          >
          </view-home>
        </dile-pages>
      </main>
      <di-spinner id="spinner"></di-spinner>
    `;
  }

  get spinner() {
    return this.shadowRoot.querySelector('#spinner');
  }

  /**
   * Navigate to a page
   * @param {Object} event
   */
  navigateTo(e) {
    this.selected = e.detail.page;
  }

  /**
   * Get the time difference between connections
   * @param {Object} event
   */
  _getDiffTime(e) {
    const { lastConnection } = e.detail;
    if (lastConnection) {
      const date = new Date();
      this.diffTime = Math.abs(date) - lastConnection;
    } else {
      this.diffTime = 0;
    }
  }

  /**
   * Set email
   * @param {Object} event
   */
  _setEmail(e) {
    this.email = e.detail;
  }

  /**
   * Handles the state of the spinner
   * @param {String} open
   */
  _handleSpinner(state) {
    if (state === 'open') {
      this.spinner.open();
    } else {
      this.spinner.close();
    }
  }
}
