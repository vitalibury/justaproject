import LoginForm from "./pages/login-page.js";
import RegistrationForm from "./pages/registration-page.js";
import UsersTable from "./pages/users-table.js";
import UserForm from "./pages/user-form.js";
import About from "./pages/about-page.js";
import PageNotFound from "./pages/not-found-page.js";

import DataService from "./data-service.js";
import Router from "./router.js";

import utils from "./utils.js";



export default class App {
  dataService = null;
  login = null;
  registration = null;
  usersTable = null;
  userForm = null;
  about = null;
  pageNotFound = null;
  router = null;

  constructor() {
    this.dataService = new DataService();
    this.login = new LoginForm(this.dataService);
    this.registration = new RegistrationForm(this.dataService);
    this.usersTable = new UsersTable(this.dataService);
    this.userForm = new UserForm(this.dataService);
    this.about = new About();
    this.pageNotFound = new PageNotFound();
    this.router = new Router(this.dataService);
  }

  init() {
    this.router.renderParticularPage();
    this.launchListeners();
  };
  
  launchListeners = () => {
    document.addEventListener('submit', this.handleFormSubmits);
    document.addEventListener('click', this.handleClicks);
    document.addEventListener('focus', this.handleFocuses, true);
    document.addEventListener('blur', this.handleBlurs, true);
    document.addEventListener('change', this.handleChanges);
    window.addEventListener('hashchange', this.router.renderParticularPage);
    window.onunload = (e) => {
      console.log(e)
      alert('asca')
    }
  };
  
    // EVENT HANDLERS

  handleFormSubmits = (e) => {
    e.preventDefault();
    const loginForm = e.target.closest('.login-form');
    if(loginForm) {
      this.login.handleLoginSubmit(loginForm);
    };

    const registrationForm = e.target.closest('.registration-form');
    if(registrationForm) {
      this.registration.handleRegistrationSubmit(registrationForm);
    };

    const userEditForm = e.target.closest('.user-edit-form');
    if(userEditForm) {
      this.userForm.handleUserEditSubmit(userEditForm);
    };
  };

  handleClicks = (e) => {
    const logout = e.target.closest('.logout');
    if(logout) {
      this.router.logout();
    };

    const userDeleteBtn = e.target.closest('.btn-delete-user');
    if(userDeleteBtn) {
      this.usersTable.handleUserDelete(userDeleteBtn.dataset.username);
    };

    const popupCancelBtn = e.target.closest('.btn-popup-cancel');
    if(popupCancelBtn) {
      this.usersTable.handleBtnCancel();
    };

    const popupConfirmBtn = e.target.closest('.btn-popup-confirm');
    if(popupConfirmBtn) {
      this.usersTable.handleBtnConfirm(popupConfirmBtn.dataset.userName);
    };

    const overlay = e.target.closest('.overlay');
    if(overlay) {
      this.usersTable.handleBtnCancel();
    };
  };

  handleFocuses = (e) => {
    const authInput = e.target.closest('.auth-input');
    if(authInput) {
      utils.handleInputFocus(e);
    };
  };

  handleBlurs = (e) => {
    const authInput = e.target.closest('.auth-input');
    if(authInput) {
      utils.handleInputBlur(e);
    };
  };

  handleChanges = (e) => {
    const avatarField = e.target.closest('.avatar-field');
    if (avatarField) {
      this.userForm.handleAvatarChange(avatarField);
    };
  };
};

