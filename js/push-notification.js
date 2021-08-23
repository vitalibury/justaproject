import { hideElement, showElement } from "./utils.js";

export default class PushNotifications {

  constructor() {}

  renderPushNotification = (target, method) => {
    const pushHtml = `
        <div class="push-notification hide alert" role="alert" style="position: absolute;"></div>
        `;
    target.insertAdjacentHTML(method, pushHtml);
  };

  showPushNotification = (content, status) => {
    const notification = document.querySelector(".push-notification");
    notification.classList.remove("alert-success");
    notification.classList.remove("alert-warning");
    notification.classList.remove("alert-danger");
    notification.innerHTML = content;
    notification.classList.add(status);
    showElement(notification);
    setTimeout(() => {
      hideElement(notification);
      notification.innerHTML = "";
    }, 1500);
  };

};