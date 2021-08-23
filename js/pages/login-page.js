import { findPageElement } from '../utils.js';


export default class LoginForm {

  constructor() {
    this.layout = loginForm;
  };

  renderLoginForm = (target) => {
    target.innerHTML = this.layout.innerHTML;
  };

  defineLoginForm = () => {
    const loginForm = findPageElement('.login-form');
    return loginForm;
  };

  defineRegistrationLink = () => {
    const registrationLink = document.querySelector('.registration-link');
    return registrationLink;
  };

};