import { LitElement, html, css } from 'lit-element';
import '@material/mwc-button';
import '../components/di-counters.js';
import '../components/di-services.js';

export class ViewHome extends LitElement {
  static get properties() {
    return {
      counters: { type: Array },
      diffTime: { type: Number },
      email: { type: String },
    };
  }

  constructor() {
    super();
    this.counters = [
      {
        name: 'days',
        number: '00',
      },
      {
        name: 'hours',
        number: '00',
      },
      {
        name: 'minutes',
        number: '00',
      },
      {
        name: 'seconds',
        number: '00',
      },
    ];
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }

      h1 {
        margin-top: 3em;
      }

      mwc-button {
        --mdc-theme-primary: #1d78df;
        --mdc-theme-on-primary: white;
      }

      di-counters {
        margin: 5em 0;
      }
    `;
  }

  render() {
    return html`
      <h1>Welcome!</h1>
      <p>The last time you accessed was</p>
      <di-counters .counters="${this.counters}"></di-counters>
      <mwc-button
        @click="${this._handlerLogout}"
        raised
        label="LOGOUT"
      ></mwc-button>
      <di-services 
        id="service"
        @logout-success="${this._handlerLogoutSuccess}"
        @logout-error="${this._handlerLogoutError}"
        @logout-finally="${this._handlerLogoutFinally}">
      </di-services>
    `;
  }

  get service() {
    return this.shadowRoot.querySelector('#service');
  }

  updated(changedProperties) {
    if (ViewHome._updatedAndNotUndefined(changedProperties, 'diffTime')) {
      this._updateCounter();
    }
  }

  /**
   * Checks that the property exists and that its value is not undefined
   * @param {Array} changedProperties
   * @param {String} field
   */
  static _updatedAndNotUndefined(changedProperties, field) {
    return (
      changedProperties.has(field) && changedProperties.get(field) !== undefined
    );
  }

  /**
   * Convert the milliseconds and update the counter
   */
  _updateCounter() {
    const milliseconds = {
      days: 86400000,
      hours: 3600000,
      minutes: 60000,
      seconds: 1000
    };
    let time = this.diffTime;

    const days = Math.floor(time / milliseconds.days);
    time -= days * 86400000;
    const hours = Math.floor(time / milliseconds.hours);
    time -= hours * 3600000;
    const minutes = Math.floor(time / milliseconds.minutes);
    time -= minutes * 60000;
    const seconds = Math.trunc(time / milliseconds.seconds);
    const timeSinceLastConnection = { days, hours, minutes, seconds };

    this.counters.forEach(counter => {
      const newTime = timeSinceLastConnection[counter.name].toString();
      counter.number = newTime.length < 2 ? `0${newTime}` : newTime; // eslint-disable-line no-param-reassign
    });
    this.counters = [...this.counters];
  }

  /**
   * Send the current time to the server and call service logout
   */
  _handlerLogout() {
    const body = {
      email: this.email, 
      lastConnection: ViewHome._getTime() 
    };

    this._dispatchEvent('handler-spinner', 'open');
    this.service.logout(body);
  }

  /**
   * Handler logout call success
   */
  _handlerLogoutSuccess(event) {
    if(event.detail.status === 200) {
      this.dispatchEvent(
        new CustomEvent('navigate-to', {
          detail: {
            page: 'login',
          },
        })
      );
    }
  }

  /**
   * Handler login call error
   * @param {*} event 
   */
  _handlerLogoutError(event) {
    console.log(event.detail.err);  // eslint-disable-line
  }

  /**
   * Handler logout call finally
   */
  _handlerLogoutFinally() {
    this._dispatchEvent('handler-spinner', 'close');
  }

  /**
   * Get current time in milliseconds
   * @return {Number}
   */
  static _getTime() {
    const date = new Date();
    return date.getTime();
  }

  /**
   * Dispatch an event
   * @param {String} event
   * @param {*} detail
   */
  _dispatchEvent(event, detail) {
    this.dispatchEvent(new CustomEvent(event, { detail }));
  }
}

window.customElements.define('view-home', ViewHome);
