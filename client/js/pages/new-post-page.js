import DataService from "../data-service.js";
import Router from "../router.js";
import PushNotifications from "../push-notification.js";
import notificationsList from "../notifications-list.js";
import modes from "../modes.js";
import utils from "../utils.js";

export default class NewPost {

  dataService = null;
  contentContainer = null;
  layout = null;
  router = null;
  notification = null;

  constructor() {
    this.layout = newPostFormTemplate;
    this.contentContainer = mainContent;
    this.dataService = new DataService();
    this.router = new Router();
    this.notification = new PushNotifications();
    modes['newPost'] = this.renderNewPostPage;
  }

  renderNewPostPage = () => {
    utils.clearElementContent(this.contentContainer);
    this.contentContainer.innerHTML = this.layout.innerHTML;
    utils.showElement(this.contentContainer);
  };

  handleNewPostSubmit = (postForm) => {
    const userId = utils.getRouteParameter(1);
    this.dataService.sendImage(this.getPostFormFile(postForm))
      .then(path => {
        const post = {...this.getFormValues(postForm), imageSrc: utils.transformImagePath(path)}
        return this.dataService.createPost(userId, post);
      })
      .then(() => {
        this.notification.showPushNotification(
          notificationsList.postCreatingSuccess,
          "alert-success"
        );
        utils.hideElement(this.contentContainer);
        this.router.goTo(`userPosts/${userId}`);
      })
      .catch(e => console.log(e));
  };

  getPostFormFile(form) {
    return form.elements[0].files[0];
  }

  getFormValues(form) {
    const post = {}
    Array.from(form.elements).slice(1, length - 1).forEach(elem => {
      post[elem.id.split('-')[1]] = elem.value; 
    });
    return post;
  }


}