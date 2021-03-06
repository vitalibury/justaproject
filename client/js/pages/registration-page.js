import DataService from "../data-service.js";
import PushNotifications from "../push-notification.js";
import Router from "../router.js";
import { validateFormField, validateFormsEqual } from "../validation.js";
import notificationsList from "../notifications-list.js";
import modes from "../modes.js";
import utils from "../utils.js";

export default class RegistrationForm {
  contentContainer = null;
  layout = null;
  dataService = null;
  router = null;
  notification = null;

  constructor() {
    this.contentContainer = mainContent;
    this.layout = registrationForm;
    this.dataService = new DataService();
    this.router = new Router();
    this.notification = new PushNotifications();
    modes["registration"] = this.renderRegistrationPage;
  }

  renderRegistrationPage = () => {
    utils.clearElementContent(this.contentContainer);
    this.contentContainer.innerHTML = this.layout.innerHTML;
    utils.showElement(this.contentContainer);
  };

  handleRegistrationSubmit = (registrationForm) => {
    const { emailField, passwordField, passwordRepeatField } = {
      emailField: utils.getFormElement(registrationForm, "email"),
      passwordField: utils.getFormElement(registrationForm, "password"),
      passwordRepeatField: utils.getFormElement(
        registrationForm,
        "passwordRepeat"
      ),
    };

    if (
      this.checkRegistartionForm(emailField, passwordField, passwordRepeatField)
    ) {
      const email = emailField.value;
      const password = passwordField.value;

      this.dataService
        .registration(email, password)
        .then(() => {
          this.notification.showPushNotification(
            notificationsList.registrationSuccess,
            "alert-success"
          );
          setTimeout(() => {
            this.router.goTo("");
          }, 1000);
        })
        .catch((error) => {
          if (error.status === 409) {
            this.notification.showPushNotification(
              error.message,
              "alert-warning"
            );
          } else {
            console.log(error);
          }
        });
    }
  };

  checkRegistartionForm(email, password, passwordRepeat) {
    const isValidEmail = !validateFormField(email);
    const isValidPassword = !validateFormField(password);
    const isPasswordsEqual = !validateFormsEqual(password, passwordRepeat);
    const isValidPasswordRepeat = !validateFormField(passwordRepeat);

    utils.focusInputLabel(email);
    utils.focusInputLabel(password);
    utils.focusInputLabel(passwordRepeat);

    if (
      isValidEmail ||
      isValidPassword ||
      isValidPasswordRepeat ||
      isPasswordsEqual
    ) {
      return false;
    }

    return true;
  }
}
