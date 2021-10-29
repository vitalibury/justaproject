import modes from "../modes.js";
import Router from "../router.js";
import utils from "../utils.js";
import PushNotifications from "../push-notification.js";
import { validateFormField } from "../validation.js";
import DataService from "../data-service.js";

export default class LoginForm {
  contentContainer = null;
  layout = null;
  dataService = null;
  router = null;
  notification = null;

  constructor() {
    this.contentContainer = mainContent;
    this.layout = loginForm;
    this.dataService = new DataService();
    this.router = new Router();
    this.notification = new PushNotifications();
    modes[""] = this.renderLoginPage;
  }

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
      const email = emailField.value;
      const password = passwordField.value;

      this.dataService
        .login(email, password)
        .then((user) => {
          this.dataService.appAuthorization = user._id;
          this.router.goTo('usersTable');
        })
        .catch((error) => {
          error.then((res) => {
            if (res.status === 404) {
              this.notification.showPushNotification(
                res.message, 
                "alert-danger"
              );
            }
          });
        });
    }
  };

  checkLoginForm(email, password) {
    const isValidEmail = !validateFormField(email);
    const isValidPassword = !validateFormField(password);

    utils.focusInputLabel(email);
    utils.focusInputLabel(password);

    if (isValidEmail || isValidPassword) {
      return false;
    }

    return true;
  }
}
