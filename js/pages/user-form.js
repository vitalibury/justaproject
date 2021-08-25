import modes from '../modes.js';
import notificationsList from '../notifications-list.js';
import PushNotifications from '../push-notification.js';
import Router from '../router.js';
import utils from '../utils.js';

export default class UserForm {

    dataService = null;
    contentContainer = null;
    layout = null;
    router = null;
    notification = null;

    constructor(dataService) {
        this.dataService = dataService;
        this.layout = userEditForm;
        this.contentContainer = mainContent;
        this.router = new Router();
        this.notification = new PushNotifications();
        modes['userEdit'] = this.renderUserFormPage;
    }

    renderUserFormPage = () => {      
        utils.clearElementContent(this.contentContainer);  
        this.contentContainer.innerHTML = this.layout.innerHTML;
        const currUser = this.dataService.getUser(utils.getRouteParameter(1));
        this.renderUserFormContent(currUser);
        utils.showElement(this.contentContainer);
    };

    renderUserFormContent = (user) => {
        const loginForm = utils.findPageElement('.user-edit-form');

        for(let i = 0; i <= 1; i++) {
            const valueForField = user[`${loginForm.elements[i].id}`];
            let formField = loginForm.elements[i];

            if (valueForField) {
                formField.value = valueForField;
            };
        };

        for(let i = 2; i <= 3; i++) {
            const valueForField = user[`${loginForm.elements[i].id}`];
            const formField = loginForm.elements[i];
            formField.checked = valueForField;
        };

        for(let i = 4; i <= 9; i++) {
            const fieldName = loginForm.elements[i].id;

            if (user.interests) {
                const valueForField = user.interests[fieldName];
                loginForm.elements[fieldName].checked = valueForField;
            };
        };

    };

    updateUserObject(formElements, user) {
        for (let i = 0; i <= 1; i++) {
            const fieldName = formElements[i].id;
            const fieldValue = formElements[i].value;
            user[fieldName] = fieldValue;
        };

        for (let i = 2; i <= 3; i++) {
            const fieldName = formElements[i].id;
            const fieldValue = formElements[i].checked;
            user[fieldName] = fieldValue;
        };

        user.interests = user.interests ? user.interests : {};


        for(let i = 4; i <=9; i++) {
            const fieldName = formElements[i].id;
            const formField = formElements[i];
            user.interests[fieldName] = formField.checked;
        };

        return user;
    };

    handleUserEditSubmit = (userForm) => {
        const currUser = this.dataService.getUser(utils.getRouteParameter(1));
        const updatedUser = this.updateUserObject(userForm.elements, currUser);
        this.notification.showPushNotification(notificationsList.savingSuccess, 'alert-success');
        utils.hideElement(this.contentContainer);
        this.router.goTo('usersTable');
      };

};