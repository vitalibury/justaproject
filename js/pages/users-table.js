import DataService from "../data-service.js";

export default class UsersTable {

    layout = null;

    constructor() {
        this.layout = usersTable;
    }

    renderTableLayout(target) {
        target.innerHTML = this.layout.innerHTML;
    };

    renderTableContent(users) {
        let currIndex = 1;
        for (const user in users) {
            if (Object.hasOwnProperty.call(users, user)) {
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
                    <button class='btn btn-outline-primary btn-edit-user'>Изменить</button>
                    <button class='btn btn-outline-danger btn-delete-user'>Удалить</button>
                    </td>`;
                usersTableBody.append(userRow);
                currIndex ++;
            };
        };
    };


};