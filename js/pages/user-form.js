import DataService from "../data-service.js";
import utils from '../utils.js';

export default class UserForm {

    dataService = null;

    layout = null;

    constructor() {
        this.dataService = new DataService();
        this.layout = userEditForm;
    }

    renderUserForm(target) {        
        target.innerHTML = this.layout.innerHTML;
    };

    renderUserFormContent(user) {
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

    defineUserEditForm = () => {
        const loginForm = utils.findPageElement('.user-edit-form');
        return loginForm;
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

};