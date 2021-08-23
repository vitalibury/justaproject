import LoginForm from "./pages/login-page.js";
import RegistrationForm from "./pages/registration-page.js";
import UsersTable from "./pages/users-table.js";
import UserForm from "./pages/user-form.js";
import About from "./pages/about-page.js";
import DataService from "./data-service.js";
import Router from "./router.js";
import PushNotifications from "./push-notification.js";
import Popup from "./pages/popup.js";

import {
  clearElementContent,
  showOverlay,
  hideOverlay,
  showPopup,
  hidePopup,
  findPageElement,
  findPageElements,
  focusInputLabel,
  getFormElement,
  inputBlurHandler,
  inputFocusHandler,
  showElement,
  hideElement,
  clearRoute,
  isAuthorized
} from "./utils.js";
import { notificationsList } from "./notifications-list.js";
import { validateFormField, validateFormsEqual } from "./validation.js";



export default class App {
  login = null;
  registration = null;
  usersTable = null;
  userForm = null;
  about = null;
  dataService = null;
  router = null;
  notification = null;
  popup = null;

  containers = {
    headerContainer: null,
    contentContainer: null,
  };

  menuButtons = [];

  isAuthorised = false;

  temporaryVariables = {
    selectedUserRow: null,
    editingUserName: null
  };

  constructor() {}

  initComponents() {
    this.login = new LoginForm();
    this.registration = new RegistrationForm();
    this.usersTable = new UsersTable();
    this.userForm = new UserForm();
    this.about = new About();
    this.dataService = new DataService();
    this.router = new Router();
    this.notification = new PushNotifications();
    this.popup = new Popup();
  };

  initContainers = () => {
    this.containers.headerContainer = document.querySelector(".page-header");
    this.containers.contentContainer = document.querySelector(".col-content");
  };

    
  modes = {
    ['']: this.launchLoginPage,
    registration: this.launchRegistrationPage,
    usersTable: this.launchUsersTablePage,
    userEdit: this.launchUserEditPage,
    about: this.launchAboutPage
  };

  init() {
    this.initComponents();
    this.initContainers();
    this.menuButtons = [...findPageElements('.menu-btn')];
    this.dataService.init();
    this.notification.renderPushNotification(
      this.containers.headerContainer,
      "afterend"
    );
    // this.launchLoginPage(this.containers.contentContainer);
    // this.launchUsersTablePage();
    // this.launchUserEditPage();
    const currMode = this.modes[clearRoute(window.location.hash)];
    currMode.call(this);
    this.setActiveMenuItem();
    window.addEventListener('hashchange', () => {
      const mode = clearRoute(window.location.hash);
      if(mode === 'usersTable' || mode === 'userEdit') {
        hideElement(this.containers.contentContainer);
        this.setActiveMenuItem();
        setTimeout(() => {
          isAuthorized() ? this.modes[mode].call(this) : this.redirectToAuthorization();
        }, 300);
      } else {
        hideElement(this.containers.contentContainer);
        this.setActiveMenuItem();
        setTimeout(() => {
          this.modes[mode].call(this);
        }, 300);
      };
    });
    findPageElement('.logout').addEventListener('click', this.logout);
  };

  redirectToAuthorization = () => {
    this.router.goTo('');
    this.notification.showPushNotification(notificationsList.signIn, 'alert-warning');
  };

  setActiveMenuItem = () => {
    this.menuButtons.forEach(el => el.classList.remove('active'));
    const activeButton = this.menuButtons.find(el => el.hash === window.location.hash);
    activeButton ? activeButton.classList.add('active') : null;
  };

  logout = () => {
    sessionStorage.removeItem('isAuthorized');
    this.router.goTo('');
  }

  // LOGIN PAGE

  launchLoginPage() {
    clearElementContent(this.containers.contentContainer);
    this.login.renderLoginForm(this.containers.contentContainer);
    this.login
      .defineLoginForm()
      .addEventListener("submit", this.handleLoginSubmit);
    this.login
      .defineRegistrationLink()
      .addEventListener("click", this.handleRegistrationPageLink);
    findPageElements("input").forEach((input) =>
      input.addEventListener("focus", inputFocusHandler)
    );
    findPageElements("input").forEach((input) =>
      input.addEventListener("blur", inputBlurHandler)
    );
    showElement(this.containers.contentContainer);
  };

  handleLoginSubmit = (event) => {
    event.preventDefault();
    const loginForm = event.target;

    const { emailField, passwordField } = {
      emailField: getFormElement(loginForm, "email"),
      passwordField: getFormElement(loginForm, "password"),
    };

    if (this.checkLoginForm(emailField, passwordField)) {
      sessionStorage.setItem('isAuthorized', true);
      loginForm.removeEventListener("submit", this.handleLoginSubmit);
      this.login
        .defineRegistrationLink()
        .removeEventListener("click", this.handleRegistrationPageLink);
      findPageElements("input").forEach((input) =>
        input.removeEventListener("focus", inputFocusHandler)
      );
      findPageElements("input").forEach((input) =>
        input.removeEventListener("blur", inputBlurHandler)
      );
      // this.launchContentPage(emailField.value);
      hideElement(this.containers.contentContainer);
      this.router.goTo('usersTable');
    };
  };

  handleRegistrationPageLink = (event) => {
    event.preventDefault();
    this.login
      .defineLoginForm()
      .removeEventListener("click", this.handleLoginSubmit);
    this.login
      .defineRegistrationLink()
      .removeEventListener("click", this.handleRegistrationPageLink);
    findPageElements("input").forEach((input) =>
      input.removeEventListener("focus", inputFocusHandler)
    );
    findPageElements("input").forEach((input) =>
      input.removeEventListener("blur", inputBlurHandler)
    );
    hideElement(this.containers.contentContainer);
    this.router.goTo('registration');
  };

  checkLoginForm(email, password) {
    const isValidEmail = !validateFormField(email);
    const isValidPassword = !validateFormField(password);

    focusInputLabel(email);
    focusInputLabel(password);

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

  // REGISTRATION PAGE

  launchRegistrationPage() {
    clearElementContent(this.containers.contentContainer);
    this.registration.renderRegistrationForm(this.containers.contentContainer);
    this.registration
      .defineRegistrationForm()
      .addEventListener("submit", this.handleRegistrationSubmit);
    findPageElements("input").forEach((input) =>
      input.addEventListener("focus", inputFocusHandler)
    );
    findPageElements("input").forEach((input) =>
      input.addEventListener("blur", inputBlurHandler)
    );
    showElement(this.containers.contentContainer);
  };

  handleRegistrationSubmit = (event) => {
    event.preventDefault();
    const registrationForm = event.target;

    const { emailField, passwordField, passwordRepeatField } = {
      emailField: getFormElement(registrationForm, "email"),
      passwordField: getFormElement(registrationForm, "password"),
      passwordRepeatField: getFormElement(registrationForm, "passwordRepeat"),
    };

    if (
      this.checkRegistartionForm(emailField, passwordField, passwordRepeatField)
    ) {
      const email = emailField.value;
      const password = passwordField.value;
      this.registration
        .defineRegistrationForm()
        .removeEventListener("submit", this.handleRegistrationSubmit);
      const newUser = { password: password };
      this.dataService.createUser(email, newUser);
      this.notification.showPushNotification(
        notificationsList.registrationSuccess,
        "alert-success"
      );
      findPageElements('input').forEach((input) =>
        input.removeEventListener("focus", inputFocusHandler)
      );
      findPageElements('input').forEach((input) =>
        input.removeEventListener("blur", inputBlurHandler)
      );
      setTimeout(() => {
        hideElement(this.containers.contentContainer);
        this.router.goTo('');
      }, 1000);
    };
  };

  checkRegistartionForm(email, password, passwordRepeat) {
    const isValidEmail = !validateFormField(email);
    const isValidPassword = !validateFormField(password);
    const isPasswordsEqual = !validateFormsEqual(password, passwordRepeat);
    const isValidPasswordRepeat = !validateFormField(passwordRepeat);

    focusInputLabel(email);
    focusInputLabel(password);
    focusInputLabel(passwordRepeat);

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



  // USERS TABLE PAGE

  launchUsersTablePage() {
    clearElementContent(this.containers.contentContainer);
    this.usersTable.renderTableLayout(this.containers.contentContainer);
    this.usersTable.renderTableContent(this.dataService.users);
    findPageElements(".btn-edit-user").forEach((user) =>
      user.addEventListener("click", this.handleUserEdit)
    );
    findPageElements(".btn-delete-user").forEach((user) =>
      user.addEventListener("click", this.handleUserDelete)
    );
    showElement(this.containers.contentContainer);
  };

  handleUserDelete = (e) => {
    showOverlay();
    showPopup();
    findPageElement(".btn-popup-confirm").addEventListener("click", this.handleBtnConfirm);
    findPageElement(".btn-popup-cancel").addEventListener("click", this.handleBtnCancel);
    overlay.addEventListener("click", this.handleBtnCancel);
    this.temporaryVariables.selectedUserRow = e.path[2];
  };

  handleUserEdit = (e) => {
    findPageElements(".btn-edit-user").forEach((user) =>
    user.removeEventListener("click", this.handleUserEdit)
  );
    findPageElements(".btn-delete-user").forEach((user) =>
    user.removeEventListener("click", this.handleUserDelete)
  );
    this.temporaryVariables.editingUserName = e.path[2].children[1].innerText;
    hideElement(this.containers.contentContainer);
    this.router.goTo('userEdit')
  };

  handleBtnConfirm = (e) => {
    overlay.removeEventListener("click", this.handleBtnCancel);
    findPageElement(".btn-popup-confirm").removeEventListener("click", this.handleBtnConfirm);
    findPageElement(".btn-popup-cancel").removeEventListener("click", this.handleBtnCancel);
    hidePopup();
    hideOverlay();
    hideElement(this.containers.contentContainer);
    setTimeout(() => {
      const editRowButton = this.temporaryVariables.selectedUserRow.children[2].children[0];
      const deleteRowButton = this.temporaryVariables.selectedUserRow.children[2].children[1];
      editRowButton.removeEventListener('click', this.handleUserEdit);
      deleteRowButton.removeEventListener('click', this.handleUserDelete);
      const currentEmail = this.temporaryVariables.selectedUserRow.children[1].innerText;
      this.dataService.deleteUser(currentEmail);
      usersTableBody.removeChild(this.temporaryVariables.selectedUserRow);
      this.temporaryVariables.selectedUserRow = null;
      showElement(this.containers.contentContainer);
    }, 300);
  };

  handleBtnCancel = (e) => {
    overlay.removeEventListener("click", this.handleBtnCancel);
    findPageElement(".btn-popup-confirm").removeEventListener("click", this.handleBtnConfirm);
    findPageElement(".btn-popup-cancel").removeEventListener("click", this.handleBtnCancel);
    hidePopup();
    hideOverlay();
    this.temporaryVariables.selectedUserRow = null;
  };


  // USER EDIT PAGE

  launchUserEditPage() {
    clearElementContent(this.containers.contentContainer);
    this.userForm.renderUserForm(this.containers.contentContainer);
    const currUser = this.dataService.getUser(this.temporaryVariables.editingUserName);
    this.userForm.renderUserFormContent(currUser);
    this.userForm.defineUserEditForm().addEventListener('submit', this.handleUserEditSubmit);
    showElement(this.containers.contentContainer);
  };

  handleUserEditSubmit = (e) => {
    e.preventDefault();
    const currUser = this.dataService.getUser(this.temporaryVariables.editingUserName);
    const updatedUser = this.userForm.updateUserObject(e.target.elements, currUser); 
    // this.dataService.updateUser(this.temporaryVariables.editingUserName, updatedUser);
    this.dataService.saveUsers();
    this.userForm.defineUserEditForm().removeEventListener('submit', this.handleUserEditSubmit);
    this.temporaryVariables.editingUserName = null;
    hideElement(this.containers.contentContainer);
    this.router.goTo('usersTable');
  };


  // CONTENT PAGE

  launchAboutPage() {
    clearElementContent(this.containers.contentContainer);
    this.about.renderAboutPage(this.containers.contentContainer);
    showElement(this.containers.contentContainer);
  };
};

