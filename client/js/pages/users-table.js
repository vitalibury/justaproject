import PushNotifications from '../push-notification.js';
import DataService from '../data-service.js';
import modes from "../modes.js";
import utils from "../utils.js";

export default class UsersTable {

  contentContainer = null;
  layout = null;
  dataService = null;
  notification = null;

    constructor() {
    this.contentContainer = mainContent;
    this.layout = usersTable;
    this.dataService = new DataService();
    this.notification = new PushNotifications();
    modes['usersTable'] = this.renderUsersTablePage;
    }

    renderUsersTablePage = async () => {
        utils.clearElementContent(this.contentContainer);
        utils.renderSpinner(this.contentContainer);
        utils.showElement(this.contentContainer);
        this.dataService.getAllUsers()
        .then(users => {
          utils.clearElementContent(this.contentContainer);
          this.contentContainer.innerHTML = this.layout.innerHTML;
          this.renderTableContent(users);
        })
        .catch(e => console.log(e));
    };

    renderTableContent(users) {
      users.forEach((user, ind) => {
        const email = user.email;
        const id = user._id;
        const userRow = document.createElement('tr');
        userRow.innerHTML = `
            <td>
            ${ind + 1}
            </td>
            <td>
            ${email}
            </td>
            <td class="user-controls">
            <a href="#userPosts/${id}" class='btn btn-outline-primary btn-user-posts'>Посты</a>
            <a href="#userEdit/${id}" class='btn btn-outline-primary btn-edit-user'>Изменить</a>
            <a class='btn btn-outline-danger btn-delete-user' data-username='${id}'>Удалить</a>
            </td>`;
        usersTableBody.append(userRow);
      });
      
      if (!users.length) {
        const table = document.querySelector('.users-table');
        table.insertAdjacentHTML('afterend', '<p>Пользователи не найдены.</p>');
      }
    };

    handleUserDelete = (id) => {
        utils.showOverlay();
        utils.showPopup();
        popupConfirm.dataset.userId = id;
      };

      handleBtnConfirm = (id) => {
        this.dataService.deleteUser(id)
        .then(response => {
            utils.hidePopup();
            utils.hideOverlay();
            this.notification.showPushNotification(
                response.message,
                "alert-success"
              );
            popupConfirm.dataset.userId = '';
            utils.hideElement(this.contentContainer);
            setTimeout(() => {
                this.renderUsersTablePage();
            }, 300);
          })
          .catch(e => console.log(e));        
      };
      
};