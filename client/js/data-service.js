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

  async getUserById(id) {
    let response = await fetch(`/api/users/${id}`, {
      method: "GET",
    });
    return utils.handleResponse(response);
  };

  async updateUser(id, user) {
    let response = await fetch(`api/users/${id}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    });
    return utils.handleResponse(response);
  };

  async deleteUser(id) {
    let response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });
    return utils.handleResponse(response);
  };

  async getPostWithComments(id) {
    let response = await fetch(`/api/posts/${id}/comments/${this.appAuthorization}`, {
      method: "GET"
    });
    return utils.handleResponse(response);
  };

  async getPostComments(id) {
    let response = await fetch(`/api/posts/${id}/comments/`, {
      method: "GET"
    });
    return utils.handleResponse(response);
  };

  async createPostComment(commentObject) {
    const currentUserId = this.appAuthorization;
    commentObject.userId = currentUserId;    
    // const newComment = {userId, content: comment};
    let response = await fetch(`/api/posts/${commentObject.post}/comments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentObject)
    });
    return utils.handleResponse(response);
  };

  async deletePostComment(id) {
    let response = await fetch(`/api/posts/${id}/comments/`, {
      method: "DELETE"
    });
    return utils.handleResponse(response);
  };

  async getAllPosts(id) {
    let response = await fetch(`/api/posts/${id}`, {
      method: "GET"
    });
    return utils.handleResponse(response);
  };

  async getUserPosts(id) {
    let response = await fetch(`/api/posts/user/${id}`, {
      method: "GET"
    });
    return utils.handleResponse(response);
  };

  async createPost(id, post) {
    let response = await fetch(`/api/posts/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post)
    });
    return utils.handleResponse(response);
  };

  async deletePost(id) {
    let response = await fetch(`/api/posts/${id}`, {
      method: "DELETE"
    });
    return utils.handleResponse(response);
  };

  async changePostRate(id, userId) {
    let response = await fetch(`api/posts/rate/${id}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({userId})
    });
    return utils.handleResponse(response);
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
