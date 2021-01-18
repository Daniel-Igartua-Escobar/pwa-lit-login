import { LitElement, html, css } from 'lit-element';
import 'dile-pages/dile-pages.js';
import './views/view-login';

export class PwaLogin extends LitElement {
  static get properties() {
    return {
      selected: {type: String}
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
            name="login">
          </view-login>
        </dile-pages>
        <view-home 
          name="home">
        </view-home>
      </main>
    `;
  }
}
