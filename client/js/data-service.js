import { appDBName } from "./config/app-keys.js";

export default class DataService {

    users = null;
    DBName = appDBName;

    constructor() {
        if (localStorage.getItem(this.DBName)) {
            const jsonUsers = localStorage.getItem(this.DBName);
            this.users = JSON.parse(jsonUsers);
        } else {
            this.users = {};
            this.saveUsers();
        };
    }

    saveUsers() {
        localStorage.setItem(this.DBName, JSON.stringify(this.users));
    };

    getUser = (email) => {
        return this.users[email];
    };

    createUser(email, user) {
        this.users[email] = user;
        this.saveUsers();
    };

    deleteUser(email) {
        delete this.users[email];
        this.saveUsers();
    };

    updateUser(userName, user) {
        this.users[userName] = user;
        this.saveUsers();
    };

    get appAuthorization() {
        return sessionStorage.getItem('isSoftGram_Authorized');
    };

    set appAuthorization(value) {
        if(value === false) {
            sessionStorage.removeItem('isSoftGram_Authorized');
        } else {
            sessionStorage.setItem('isSoftGram_Authorized', value);
        };
    };
};