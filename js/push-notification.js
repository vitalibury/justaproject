import utils from './utils.js';

export default class PushNotifications {

  headerContainer = null;

  constructor() {
    this.headerContainer = pageHeader;
  }

  renderPushNotification = () => {
    const pushHtml = `
        <div class="push-notification hide alert" role="alert" style="position: absolute;"></div>
        `;
    this.headerContainer.insertAdjacentHTML("afterend", pushHtml);
  };

  showPushNotification = (content, status) => {
    const notification = document.querySelector(".push-notification");
    notification.classList.remove("alert-success");
    notification.classList.remove("alert-warning");
    notification.classList.remove("alert-danger");
    notification.innerHTML = content;
    notification.classList.add(status);
    utils.showElement(notification);
    setTimeout(() => {
      utils.hideElement(notification);
      notification.innerHTML = "";
    }, 1500);
  };

};