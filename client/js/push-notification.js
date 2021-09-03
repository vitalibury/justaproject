import utils from './utils.js';

export default class PushNotifications {

  notificationContainer = null;

  constructor() {
    this.notificationContainer = notificationContainer;
  }

  showPushNotification = (content, status) => {
    this.notificationContainer.classList.remove("alert-success");
    this.notificationContainer.classList.remove("alert-warning");
    this.notificationContainer.classList.remove("alert-danger");
    this.notificationContainer.innerHTML = content;
    this.notificationContainer.classList.add(status);
    utils.showElement(this.notificationContainer);
    setTimeout(() => {
      utils.hideElement(this.notificationContainer);
      this.notificationContainer.innerHTML = "";
    }, 1500);
  };

};