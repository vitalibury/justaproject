import LoginForm from "./pages/login-page.js";
import RegistrationForm from "./pages/registration-page.js";
import UsersTable from "./pages/users-table.js";
import UserForm from "./pages/user-form.js";
import About from "./pages/about-page.js";
import UserPosts from "./pages/posts-page.js";
import NewPost from "./pages/new-post-page.js";
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
  userPosts = null;
  newPost = null;
  about = null;
  pageNotFound = null;
  router = null;

  constructor() {
    this.dataService = new DataService();
    this.login = new LoginForm(this.dataService);
    this.registration = new RegistrationForm(this.dataService);
    this.usersTable = new UsersTable(this.dataService);
    this.userForm = new UserForm(this.dataService);
    this.userPosts = new UserPosts(this.dataService);
    this.newPost = new NewPost(this.dataService);
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

    const newPostForm = e.target.closest('.new-post-form');
    if (newPostForm) {
      this.newPost.handleNewPostSubmit(newPostForm);
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
      utils.handleBtnCancel();
    };

    const popupConfirmBtn = e.target.closest('.btn-popup-confirm');
    if(popupConfirmBtn) {
      popupConfirmBtn.dataset.username ? this.usersTable.handleBtnConfirm(popupConfirmBtn.dataset.username) : null;
      popupConfirmBtn.dataset.postId ? this.userPosts.handleBtnConfirm(popupConfirmBtn.dataset.postId) : null;
    };

    const overlay = e.target.closest('.overlay');
    if(overlay) {
      utils.handleBtnCancel();
    };

    const postDeleteBtn = e.target.closest('.btn-delete-post');
    if(postDeleteBtn) {
      this.userPosts.handlePostDelete(postDeleteBtn.dataset.postid);
    };

    const createPostBtn = e.target.closest('.new-post-btn');
    if(createPostBtn) {
      this.userPosts.handleCreatePostBtn();
    }
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
    const imageField = e.target.closest('.image-input-field');
    if (imageField) {
      utils.handleImageChange(imageField);
    };
  };
};

