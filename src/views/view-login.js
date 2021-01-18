import { LitElement, html, css } from 'lit-element';
import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-icon';

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
        color: #1D78DF;
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
          autoValidate>
        </mwc-textfield>
        <mwc-textfield 
          id="password" 
          label="Password" 
          minlength="8" 
          type="password" 
          validationMessage="Mínimo 8 digitos"
          helper="Mínimo 8 digitos"
          required
          autoValidate>
        </mwc-textfield>
        <mwc-button @click="${this._handleLogin}" raised label="Log in"></mwc-button>
      </form>
    `;
  }

  get email() {
    return this.shadowRoot.querySelector('#email');
  }

  get password() {
    return this.shadowRoot.querySelector('#password');
  }

  /**
   * Check that the user's data is valid
   */
  _handleLogin() {
    const email = this.email.value;
    const password = this.password.value;

    if(!email) {
      this.email.reportValidity();
    }

    if(!password) {
      this.password.reportValidity();
    }

    if(this.email.checkValidity() && this.password.checkValidity()) {
      this._login({email, password});
    } 
  }

  /**
   * Sends user data to the server and handles the response
   * @param {*} body
   */
  _login(body) {
    fetch('http://localhost:3000/api/user', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json().then(data => ({status: res.status, body: data})))
    .then( res => {
      switch (res.status) {
        case 200:
          this._dispatchEvent('last-connection', { lastConnection: res.body.lastConnection} );
          this._dispatchEvent('navigate-to', { page: 'home' });
          this._dispatchEvent('email', this.email.value);
          break;
        case 302:
          const error = res.body.error;
          const objError = {
            email: 'Email incorrecto',
            password: 'Contraseña incorrecta',
            default: 'Error'
          }

          if(error) {
            this[error].validationMessage = objError[error];
            this[error].value = '';
          }

          break;
        default:
          break;
      }
    })
    .catch( err => {
      console.log(err);
    });
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

window.customElements.define('view-login', ViewLogin);