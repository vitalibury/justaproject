import { serverURL } from "../config/app-keys.js";
import modes from "../modes.js";
import notificationsList from "../notifications-list.js";
import PushNotifications from "../push-notification.js";
import Router from "../router.js";
import utils from "../utils.js";

export default class UserForm {
  dataService = null;
  contentContainer = null;
  layout = null;
  router = null;
  notification = null;

  constructor(dataService) {
    this.dataService = dataService;
    this.layout = userEditTemplate;
    this.contentContainer = mainContent;
    this.router = new Router();
    this.notification = new PushNotifications();
    modes["userEdit"] = this.renderUserFormPage;
  };

  renderUserFormPage = () => {
    utils.clearElementContent(this.contentContainer);
    utils.renderSpinner();
    utils.showElement(this.contentContainer);
    this.dataService.getUserByEmail(utils.getRouteParameter(1))
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
      avatarImage.style.backgroundImage = `url('${userAvatarPath}')`;
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

        this.sendImage(file).then((path) => {
          user.avatar = `${serverURL}/${JSON.parse(path)
            .split("\\")
            .join("/")}`;
          resolve(user);
        });
      } else {
        resolve(user);
      }
    });
  }

  sendImage = (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", file);
      var xhr = new XMLHttpRequest();
      xhr.open("POST", `${serverURL}/uploads`);

      xhr.onload = () => {
        if (xhr.status === 201) {
          resolve(xhr.response);
        }
      };

      xhr.onerror = () => {
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
        });
      };

      xhr.send(formData);
    });
  };

  handleUserEditSubmit = (userForm) => {
    const userEmail = utils.getRouteParameter(1);
    this.updateUserObject(userForm.elements)
      .then((user) => {
        return this.dataService.updateUser(userEmail, user);
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

  handleAvatarChange = (avatarField) => {
    const [file] = avatarField.files;
    if (file) {
      avatarImage.style.backgroundImage = `url('${URL.createObjectURL(file)}')`;
    }
  };
}
