import modes from '../modes.js';
import notificationsList from '../notifications-list.js';
import PushNotifications from '../push-notification.js';
import Router from '../router.js';
import utils from '../utils.js';
import { validateFormField, validateFormsEqual } from '../validation.js';

export default class RegistrationForm {

  contentContainer = null;
  layout = null;
  dataService = null;
  router = null;
  notification = null;

  constructor(dataService) {
    this.contentContainer = mainContent;
    this.layout = registrationForm;
    this.dataService = dataService;
    this.router = new Router();
    this.notification = new PushNotifications();
    modes['registration'] = this.renderRegistrationPage;
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
      passwordRepeatField: utils.getFormElement(registrationForm, "passwordRepeat"),
    };

    if (
      this.checkRegistartionForm(emailField, passwordField, passwordRepeatField)
    ) {
      const email = emailField.value;
      const password = passwordField.value;
      const newUser = { password: password };
      this.dataService.createUser(email, newUser);
      this.notification.showPushNotification(
        notificationsList.registrationSuccess,
        "alert-success"
      );
      setTimeout(() => {
        this.router.goTo('');
      }, 1000);
    };
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
    };

    const user = this.dataService.getUser(email.value.trim());
    if (user) {
      this.notification.showPushNotification(
        notificationsList.emailAlreadyExist,
        "alert-warning"
      );

      return false;

    };

    return true;

  };

};