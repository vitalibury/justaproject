import modes from "../modes.js";
import notificationsList from '../notifications-list.js';
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

    renderUsersTablePage = () => {
        utils.clearElementContent(this.contentContainer);
        this.contentContainer.innerHTML = this.layout.innerHTML;
        this.renderTableContent(this.dataService.users);
        utils.showElement(this.contentContainer);
    };

    renderTableContent(users) {
        let currIndex = 1;
        for (const user in users) {
            if (users.hasOwnProperty(user)) {
                const element = users[user];
                const userRow = document.createElement('tr');
                userRow.innerHTML = `
                    <td>
                    ${currIndex}
                    </td>
                    <td>
                    ${user}
                    </td>
                    <td>
                    <a href="#userEdit/${user}" class='btn btn-outline-primary btn-edit-user'>Изменить</a>
                    <a class='btn btn-outline-danger btn-delete-user' data-username='${user}'>Удалить</a>
                    </td>`;
                usersTableBody.append(userRow);
                currIndex ++;
            };
        };
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

      handleBtnConfirm = (username) => {
        utils.hidePopup();
        utils.hideOverlay();
        this.dataService.deleteUser(username);
        
        this.notification.showPushNotification(
            notificationsList.deletionSuccess,
            "alert-success"
          );
        popupConfirm.dataset.username = '';
        utils.hideElement(this.contentContainer);
        setTimeout(() => {
            this.renderUsersTablePage();
        }, 300);
      };
      
};