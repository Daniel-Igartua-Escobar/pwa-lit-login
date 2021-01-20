import { LitElement, html, css } from 'lit-element';
import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-icon';
import '../components/di-services.js';

export class ViewLogin extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }
      .login {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100vh;
      }

      .login mwc-button {
        --mdc-theme-primary: #004481;
        --mdc-theme-on-primary: white;
        --mdc-typography-button-text-transform: capitalize;
      }

      .login mwc-textfield {
        margin-bottom: 1rem;
        --mdc-text-field-fill-color: white;
        --mdc-theme-primary: #004481;
      }

      .fancy {
        color: #1d78df;
        --mdc-icon-size: 8rem;
        margin-bottom: 4rem;
      }
    `;
  }

  render() {
    return html`
      <form class="login">
        <mwc-icon class="fancy" outlined>lock</mwc-icon>
        <mwc-textfield
          id="email"
          label="Email"
          type="email"
          validationMessage="Formato de correo no válido"
          required
          autoValidate
        >
        </mwc-textfield>
        <mwc-textfield
          id="password"
          label="Password"
          minlength="8"
          type="password"
          validationMessage="Mínimo 8 digitos"
          helper="Mínimo 8 digitos"
          required
          autoValidate
        >
        </mwc-textfield>
        <mwc-button
          @click="${this._handleLogin}"
          raised
          label="Log in"
        ></mwc-button>
      </form>
      <di-services 
        id="service"
        @login-success="${this._handlerLoginSuccess}"
        @login-error="${this._handlerLoginError}"
        @login-finally="${this._handlerLoginFinally}">
      </di-services>
    `;
  }

  get email() {
    return this.shadowRoot.querySelector('#email');
  }

  get password() {
    return this.shadowRoot.querySelector('#password');
  }

  get service() {
    return this.shadowRoot.querySelector('#service');
  }

  /**
   * Check that the user's data is valid and call service login
   */
  _handleLogin() {
    const email = this.email.value;
    const password = this.password.value;

    if (!email) {
      this.email.reportValidity();
    }

    if (!password) {
      this.password.reportValidity();
    }

    if (this.email.checkValidity() && this.password.checkValidity()) {
      this._dispatchEvent('handle-spinner', 'open');
      this.service.login({ email, password });
    }
  }

  /**
   * Handler login call success
   * @param {*} event 
   */
  _handlerLoginSuccess(event) {
      switch (event.detail.status) {
        case 200:
          this._dispatchEvent('last-connection', {
            lastConnection: event.detail.body.lastConnection,
          });
          this._dispatchEvent('navigate-to', { page: 'home' });
          this._dispatchEvent('email', this.email.value);
          break;
        case 302:
          this._handlerErrors(event.detail.body.error);
          break;
        default:
          break;
      }
  }

  /**
   * Handler login call error
   * @param {*} event 
   */
  _handlerLoginError(event) {
    console.log(event.detail.err);  // eslint-disable-line
  }

 /**
  * Handler login call finally
  */
  _handlerLoginFinally() {
    this._dispatchEvent('handler-spinner', 'close');
  }

  /**
   * Dispatch an event
   * @param {String} event
   * @param {*} detail
   */
  _dispatchEvent(event, detail) {
    this.dispatchEvent(new CustomEvent(event, { detail }));
  }

  /**
   * Manages errors in the success call
   * @param {String} error
   */
  _handlerErrors(error) {
    const objError = {
      email: 'Email incorrecto',
      password: 'Contraseña incorrecta',
    };

    if (error) {
      this[error].validationMessage = objError[error];
      this[error].value = '';
    }
  }
}

window.customElements.define('view-login', ViewLogin);
