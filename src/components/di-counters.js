import { LitElement, html, css } from 'lit-element';


export class DiCounters extends LitElement {
  static get properties() {
    return {
      counters: {type: Array}
    };
  }

  constructor() {
    super();
    this.counters = [
      {
        name: 'days',
        number: '00'
      },
      {
        name: 'hours',
        number: '00'
      },
      {
        name: 'minutes',
        number: '00'
      },
      {
        name: 'seconds',
        number: '00'
      }
    ]
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .counters {
        display: flex;
        justify-content: center;
        color: gray;
      }

      .count {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .count:not(:last-child) {
        margin-right: 1.5rem;
      }

      .number {
        font-size: 4rem;
      }

      .name {
        font-size: 1rem;
      }

      @media screen and (max-width: 366px) {

        .number {
          font-size: 3rem;
        }
  
        .name {
          font-size: 0.8rem;
        }
    }
    `;
  }

  render() {
    return html`
      <div class="counters">
        ${this.counters.map(counter => html`
          <span class="count">
            <span class="number">${counter.number}</span>
            <span class="name">${counter.name}</span>
          </span>
        `)}
      </div>
    `;
  }
}

window.customElements.define('di-counters', DiCounters);