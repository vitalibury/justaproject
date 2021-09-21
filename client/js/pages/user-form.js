import DataService from "../data-service.js";
import PushNotifications from "../push-notification.js";
import Router from "../router.js";
import notificationsList from "../notifications-list.js";
import modes from "../modes.js";
import utils from "../utils.js";
import { serverURL } from "../config/app-keys.js";

export default class UserForm {
  dataService = null;
  contentContainer = null;
  layout = null;
  router = null;
  notification = null;

  constructor() {
    this.layout = userEditTemplate;
    this.contentContainer = mainContent;
    this.dataService = new DataService();
    this.router = new Router();
    this.notification = new PushNotifications();
    modes["userEdit"] = this.renderUserFormPage;
  };

  renderUserFormPage = () => {
    utils.clearElementContent(this.contentContainer);
    utils.renderSpinner(this.contentContainer);
    utils.showElement(this.contentContainer);
    this.dataService.getUserById(utils.getRouteParameter(1))
      .then(user => {
        utils.clearElementContent(this.contentContainer);
        this.contentContainer.innerHTML = this.layout.innerHTML;
        this.renderUserFormContent(user);
      })
      .catch(e => console.log(e));
  };

  renderUserFormContent = (user) => {
    for (let i = 0; i <= 1; i++) {
      const valueForField = user[userEditForm.elements[i].id];
      const formField = userEditForm.elements[i];

      if (valueForField) {

        formField.value = userEditForm.elements[i].type === 'date' ?
          new Date(valueForField).toLocaleDateString().split('.').reverse().join('-') :
          valueForField;
      }
    }

    for (let i = 2; i <= 3; i++) {
      const valueForField = user[userEditForm.elements[i].id];
      const formField = userEditForm.elements[i];
      formField.checked = valueForField;
    }

    for (let i = 4; i <= 9; i++) {
      const fieldName = userEditForm.elements[i].id;

      if (user.interests) {
        const valueForField = user.interests[fieldName];
        userEditForm.elements[fieldName].checked = valueForField;
      }
    }

    const userAvatarPath = user[userEditForm.elements[10].id];
    if (userAvatarPath) {
      imagePreview.style.backgroundImage = `url('${serverURL}${userAvatarPath}')`;
    }
  };

  updateUserObject(formElements) {
    const user = {};
    user.interests = {};
    for (let i = 0; i <= 1; i++) {
      const fieldName = formElements[i].id;
      const fieldValue = formElements[i].value;
      user[fieldName] = fieldValue;
    }

    for (let i = 2; i <= 3; i++) {
      const fieldName = formElements[i].id;
      const fieldValue = formElements[i].checked;
      user[fieldName] = fieldValue;
    }

    for (let i = 4; i <= 9; i++) {
      const fieldName = formElements[i].id;
      const formField = formElements[i];
      user.interests[fieldName] = formField.checked;
    }

    return new Promise((resolve, reject) => {
      if (formElements[10].value) {
        const file = formElements[10].files[0];
        if (
          !file.type.match("image.jpeg") &&
          !file.type.match("image.jpg") &&
          !file.type.match("image.png")
        ) {
          this.notification.showPushNotification(
            notificationsList.notSupportedFile,
            "alert-warning"
          );
          return;
        }

        this.dataService.sendImage(file).then((path) => {
          user.avatar = utils.transformImagePath(path);
          resolve(user);
        });
      } else {
        resolve(user);
      }
    });
  };

  handleUserEditSubmit = (userForm) => {
    const userId = utils.getRouteParameter(1);
    this.updateUserObject(userForm.elements)
      .then((user) => {
        return this.dataService.updateUser(userId, user);
      })
      .then(() => {
        this.notification.showPushNotification(
          notificationsList.savingSuccess,
          "alert-success"
        );
        utils.hideElement(this.contentContainer);
        this.router.goTo("usersTable");
      })
      .catch((e) => console.log(e));
  };
}
