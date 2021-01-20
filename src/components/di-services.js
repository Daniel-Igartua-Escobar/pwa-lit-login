import { LitElement } from 'lit-element';

export class DiServices extends LitElement {

 /**
  * Call to login service
  * @param {Object} body 
  */
  login(body) {
    fetch('https://apinode2021.herokuapp.com/api/user', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    .then(res =>
        res.json().then(data => ({ status: res.status, body: data }))
    )
    .then(res => {
        this._dispatchEvent('login-success', res);
    })
    .catch(err => {
        this._dispatchEvent('login-error', err);
    })
    .finally(() => {
        this._dispatchEvent('login-finally');
    });
  }

 /**
  * Call to logout service
  * @param {Object} body 
  */
  logout(body) {
    fetch('https://apinode2021.herokuapp.com/api/user', {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    .then(res => {
        this._dispatchEvent('logout-success', res);
    })
    .catch(err => {
        this._dispatchEvent('logout-error', err);
    })
    .finally(() => {
        this._dispatchEvent('logout-finally');
    });
  }

  /**
   * Dispatch an event
   * @param {String} event
   * @param {*} detail
   */
  _dispatchEvent(event, detail) {
    this.dispatchEvent(new CustomEvent(event, { detail, bubbles: true, composed: true }));
  }

}

window.customElements.define('di-services', DiServices);
