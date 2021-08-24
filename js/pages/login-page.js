import utils from '../utils.js';


export default class LoginForm {

  constructor() {
    this.layout = loginForm;
  };

  renderLoginForm = (target) => {
    target.innerHTML = this.layout.innerHTML;
  };

  defineLoginForm = () => {
    const loginForm = utils.findPageElement('.login-form');
    return loginForm;
  };

  defineRegistrationLink = () => {
    const registrationLink = document.querySelector('.registration-link');
    return registrationLink;
  };

};