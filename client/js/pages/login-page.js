import modes from '../modes.js';
import Router from '../router.js';
import utils from '../utils.js';
import notificationsList from '../notifications-list.js';
import PushNotifications from '../push-notification.js';
import { validateFormField } from '../validation.js';


export default class LoginForm {

  contentContainer = null;
  layout = null;
  dataService = null;
  router = null;
  notification = null;

  constructor(dataService) {
    this.contentContainer = mainContent;
    this.layout = loginForm;
    this.dataService = dataService;
    this.router = new Router();
    this.notification = new PushNotifications();
    modes[''] = this.renderLoginPage;
  };

  renderLoginPage = () => {
    utils.clearElementContent(this.contentContainer);
    this.contentContainer.innerHTML = this.layout.innerHTML;
    utils.showElement(this.contentContainer);
  };

  handleLoginSubmit = (loginForm) => {

    const { emailField, passwordField } = {
      emailField: utils.getFormElement(loginForm, "email"),
      passwordField: utils.getFormElement(loginForm, "password"),
    };

    if (this.checkLoginForm(emailField, passwordField)) {
      this.dataService.appAuthorization = true;
      this.router.goTo('usersTable');
    };
  };

  checkLoginForm(email, password) {
    const isValidEmail = !validateFormField(email);
    const isValidPassword = !validateFormField(password);

    utils.focusInputLabel(email);
    utils.focusInputLabel(password);

    if (isValidEmail || isValidPassword) {
      return false;
    };

    const user = this.dataService.getUser(email.value.trim());
    if (!user) {
      this.notification.showPushNotification(
        notificationsList.emailNotExist,
        "alert-danger"
      );
      return false;
    };

    if (!(user.password === password.value.trim())) {
      this.notification.showPushNotification(
        notificationsList.passwordIncorrect,
        "alert-danger"
      );

      return false;

    };

    return true;

  };

};