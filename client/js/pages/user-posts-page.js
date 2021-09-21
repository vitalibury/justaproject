import DataService from "../data-service.js";
import PushNotifications from "../push-notification.js";
import Router from "../router.js";
import modes from "../modes.js";
import utils from "../utils.js";
import { serverURL } from "../config/app-keys.js";


export default class UserPosts {

  dataService = null;
  contentContainer = null;
  postsContainer = null;
  layout = null;
  postsContainer = null;
  router = null;
  notification = null;

  constructor() {
    this.dataService = new DataService();
    this.router = new Router();
    this.notification = new PushNotifications();
    this.contentContainer = mainContent;
    this.layout = userPostsTemplate;
    modes['userPosts'] = this.renderUserPostsPage;
  }

  renderUserPostsPage = () => {
    utils.clearElementContent(this.contentContainer);
    this.contentContainer.innerHTML = this.layout.innerHTML;
    this.postsContainer = userPostsContainer;
    utils.renderSpinner(this.postsContainer);
    utils.showElement(this.contentContainer);
    this.dataService.getUserPosts(utils.getRouteParameter(1))
      .then(posts => {
        utils.clearElementContent(this.postsContainer);
        this.renderUserPosts(posts);
      })
      .catch(e => console.log(e));
  };

  renderUserPosts = (posts) => {
    if (!posts.length) {
      this.postsContainer.insertAdjacentHTML('afterbegin', '<p>Посты не найдены.</p>');
    } else {
      posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList.add('card');
        postCard.classList.add('mb-3');
        postCard.innerHTML = `
        <img src="${serverURL}${post.imageSrc}" class="card-img-top" alt="${post.title}">
        <div class="card-body">
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${post.description}</p>
          <div class="card-bottom-section">
            <p class="card-text"><small class="text-muted">${new Date(post.date).toLocaleDateString()}</small></p>
            <a class="btn btn-outline-danger btn-delete-post" data-postId='${post._id}'>Удалить</a>
          </div>
        </div>
        `
        this.postsContainer.append(postCard);
      });
    };
  };

  handlePostDelete(postID) {
    utils.showOverlay();
    utils.showPopup();
    popupConfirm.dataset.postId = postID;
  };

  handleBtnConfirm = () => {
    this.dataService.deletePost(popupConfirm.dataset.postId)
      .then(response => {
        utils.hidePopup();
        utils.hideOverlay();
        this.notification.showPushNotification(
            response.message,
            "alert-success"
          );
        popupConfirm.dataset.postId = '';
        utils.hideElement(this.contentContainer);
        this.renderPostsPage();
      })
      .catch(e => console.log(e));
  };

  handleCreatePostBtn = () => {
    const id = utils.getRouteParameter(1);
    this.router.goTo(`newPost/${id}`);
  };
};
