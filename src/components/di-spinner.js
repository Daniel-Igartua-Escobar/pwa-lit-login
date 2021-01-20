import { LitElement, html, css } from 'lit-element';

export class DiSpinner extends LitElement {
  static get properties() {
    return {
      opened: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.opened = false;
  }

  static get styles() {
    return css`
      :host {
        display: contents;
      }

      .loader {
        border: 5px solid #f3f3f3;
        border-radius: 50%;
        border-top: 5px solid #3498db;
        width: 120px;
        height: 120px;
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 2s linear infinite;
      }

      .loader-container{
        background-color: lightgrey;
        opacity: 0.5;
        width: 100vw;
        display: none;
        align-items: center;
        justify-content: center;
        height: 100vh;
        position: absolute;
      }

      .opened {
        display: flex;
      }
      
      /* Safari */
      @-webkit-keyframes spin {
        0% { -webkit-transform: rotate(0deg); }
        100% { -webkit-transform: rotate(360deg); }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    }
    `;
  }

  render() {
    return html`
      <div
        class="${this.opened ? 'loader-container opened' : 'loader-container'}"
      >
        <div class="loader"></div>
      </div>
    `;
  }

  /**
   * Show loader
   */
  open() {
    this.opened = true;
  }

  /**
   * Close loader
   */
  close() {
    this.opened = false;
  }
}

window.customElements.define('di-spinner', DiSpinner);
