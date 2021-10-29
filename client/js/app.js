import LoginForm from "./pages/login-page.js";
import RegistrationForm from "./pages/registration-page.js";
import UsersTable from "./pages/users-table.js";
import UserForm from "./pages/user-form.js";
import About from "./pages/about-page.js";
import AllPosts from "./pages/all-posts-page.js";
import UserPosts from "./pages/user-posts-page.js";
import NewPost from "./pages/new-post-page.js";
import PageNotFound from "./pages/not-found-page.js";

import DataService from "./data-service.js";
import Router from "./router.js";

import utils from "./utils.js";
import PostComments from "./pages/comments-page.js";


export default class App {
  dataService = null;
  login = null;
  registration = null;
  usersTable = null;
  userForm = null;
  posts = null;
  userPosts = null;
  newPost = null;
  postComments = null;
  about = null;
  pageNotFound = null;
  router = null;

  constructor() {
    this.dataService = new DataService();
    this.login = new LoginForm();
    this.registration = new RegistrationForm();
    this.usersTable = new UsersTable();
    this.userForm = new UserForm();
    this.posts = new AllPosts();
    this.userPosts = new UserPosts();
    this.newPost = new NewPost();
    this.postComments = new PostComments();
    this.about = new About();
    this.pageNotFound = new PageNotFound();
    this.router = new Router();
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

    const commentForm = e.target.closest('.comment-field-form');
    if (commentForm) {
      this.postComments.handleCommentSubmit(commentForm);
    }
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
      popupConfirmBtn.dataset.userId ? this.usersTable.handleBtnConfirm(popupConfirmBtn.dataset.userId) : null;
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
    };

    const ratePostBtn = e.target.closest('.rate-post-btn');
    if(ratePostBtn) {
      this.posts.handlePostRate(ratePostBtn.parentElement);
    };

    const commentRemoveBtn = e.target.closest('.delete-comment');
    if(commentRemoveBtn) {
      this.postComments.handleCommentDeleteBtn(commentRemoveBtn);
    };

    const commentAnswerBtn = e.target.closest('.comment-answer');
    if(commentAnswerBtn) {
      this.postComments.handleCommentAnswerBtn(commentAnswerBtn);
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
    const imageField = e.target.closest('.image-input-field');
    if (imageField) {
      utils.handleImageChange(imageField);
    };
  };
};

