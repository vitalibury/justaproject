import { appDBName, serverURL } from "./config/app-keys.js";
import utils from "./utils.js";

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
    }
  }

  async login(email, password) {
    const user = { email, password };
    let response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return utils.handleResponse(response);
  };

  async registration(email, password) {
    const user = { email, password };
    let response = await fetch("/api/auth/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return utils.handleResponse(response);
  };

  async getAllUsers() {
    let response = await fetch('/api/users/', {
      method: "GET"
    });
    return utils.handleResponse(response);
  };

  async getUserByEmail(email) {
    let response = await fetch(`/api/users/${email}`, {
      method: "GET",
    });
    return utils.handleResponse(response);
  };

  async updateUser(email, user) {
    let response = await fetch(`api/users/${email}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    });
    return utils.handleResponse(response);
  };

  async deleteUser(email) {
    let response = await fetch(`/api/users/${email}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });
    return utils.handleResponse(response);
  };

  get appAuthorization() {
    return sessionStorage.getItem("isSoftGram_Authorized");
  };

  set appAuthorization(value) {
    if (value === false) {
      sessionStorage.removeItem("isSoftGram_Authorized");
    } else {
      sessionStorage.setItem("isSoftGram_Authorized", value);
    }
  };
}
