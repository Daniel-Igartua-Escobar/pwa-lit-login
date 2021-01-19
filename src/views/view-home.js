import { LitElement, html, css } from 'lit-element';
import '@material/mwc-button';
import '../components/di-counters.js';

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
        @click="${this._handleLogout}"
        raised
        label="LOGOUT"
      ></mwc-button>
    `;
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
    let time = this.diffTime;
    const days = Math.floor(time / 86400000);
    time -= days * 86400000;
    const hours = Math.floor(time / 3600000);
    time -= hours * 3600000;
    const minutes = Math.floor(time / 60000);
    time -= minutes * 60000;
    const seconds = Math.trunc(time / 1000);
    const timeSinceLastConnection = { days, hours, minutes, seconds };

    this.counters.forEach(counter => {
      const newTime = timeSinceLastConnection[counter.name].toString();
      counter.number = newTime.length < 2 ? `0${newTime}` : newTime; // eslint-disable-line no-param-reassign
    });
    this.counters = [...this.counters];
  }

  /**
   * Send the current time to the server and manage the disconnection
   */
  _handleLogout() {
    fetch('https://apinode2021.herokuapp.com/api/user', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.email,
        lastConnection: ViewHome._getTime(),
      }),
    })
      .then(res =>
        res.json().then(data => ({ status: res.status, body: data }))
      )
      .then(res => {
        if (res.status === 200) {
          this.dispatchEvent(
            new CustomEvent('navigate-to', {
              detail: {
                page: 'login',
              },
            })
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  /**
   * Get current time in milliseconds
   * @return {Number}
   */
  static _getTime() {
    const date = new Date();
    return date.getTime();
  }
}

window.customElements.define('view-home', ViewHome);
