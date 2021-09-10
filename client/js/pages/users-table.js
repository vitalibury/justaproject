import modes from "../modes.js";
import PushNotifications from '../push-notification.js';
import utils from "../utils.js";

export default class UsersTable {

  contentContainer = null;
  layout = null;
  dataService = null;
  notification = null;

    constructor(dataService) {
    this.contentContainer = mainContent;
    this.layout = usersTable;
    this.dataService = dataService;
    this.notification = new PushNotifications();
    modes['usersTable'] = this.renderUsersTablePage;
    }

    renderUsersTablePage = async () => {
        utils.clearElementContent(this.contentContainer);
        utils.renderSpinner();
        utils.showElement(this.contentContainer);
        this.dataService.getAllUsers()
        .then(users => {
          utils.clearElementContent(this.contentContainer);
          utils.renderSpinner();
          this.contentContainer.innerHTML = this.layout.innerHTML;
          this.renderTableContent(users);
        })
        .catch(e => console.log(e));
    };

    renderTableContent(users) {
      users.forEach((user, ind) => {
        const email = user.email;
        const userRow = document.createElement('tr');
        userRow.innerHTML = `
            <td>
            ${ind + 1}
            </td>
            <td>
            ${email}
            </td>
            <td>
            <a href="#userEdit/${email}" class='btn btn-outline-primary btn-edit-user'>Изменить</a>
            <a class='btn btn-outline-danger btn-delete-user' data-username='${email}'>Удалить</a>
            </td>`;
        usersTableBody.append(userRow);
      });
      
      if (!users.length) {
        const table = document.querySelector('.users-table');
        table.insertAdjacentHTML('afterend', '<p>Пользователи не найдены.</p>');
      }
    };

    handleUserDelete = (username) => {
        utils.showOverlay();
        utils.showPopup();
        popupConfirm.dataset.username = username;
      };

      handleBtnCancel = () => {
        utils.hidePopup();
        utils.hideOverlay();
        popupConfirm.dataset.username = '';
      };

      handleBtnConfirm = () => {
        this.dataService.deleteUser(popupConfirm.dataset.username)
        .then(response => {
            utils.hidePopup();
            utils.hideOverlay();
            this.notification.showPushNotification(
                response.message,
                "alert-success"
              );
            popupConfirm.dataset.username = '';
            utils.hideElement(this.contentContainer);
            setTimeout(() => {
                this.renderUsersTablePage();
            }, 300);
          })
          .catch(e => console.log(e));        
      };
      
};