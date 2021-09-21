import DataService from "../data-service.js";
import modes from "../modes.js";
import utils from "../utils.js";
import { serverURL } from "../config/app-keys.js";


export default class AllPosts {

  dataService = null;
  contentContainer = null;

  constructor() {
    this.dataService = new DataService();
    this.contentContainer = mainContent;
    modes['posts'] = this.renderAllPostsPage;
  }

  renderAllPostsPage = () => {
    utils.clearElementContent(this.contentContainer);
    utils.renderSpinner(this.contentContainer);
    utils.showElement(this.contentContainer);
    this.dataService.getAllPosts()
    .then(posts => {
      utils.clearElementContent(this.contentContainer);
      this.renderUserPosts(posts);
    })
    .catch(e => console.log(e));
  };
  
  renderUserPosts = (posts) => {
    if (!posts.length) {
      this.contentContainer.insertAdjacentHTML('afterbegin', '<p>Посты не найдены.</p>');
    } else {
      const postsContainer = document.createElement('div');
      postsContainer.classList.add('posts-container');
      posts.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      }).forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList.add('card');
        postCard.classList.add('mb-3');
        postCard.innerHTML = `
        <div class="card-header" style="width: 100%; padding: 0; margin-bottom: 0.5rem; display: flex; align-items: center;">
          <img src="${serverURL}${post.user.avatar}" class="" style="width: 2rem" alt="${post.user.email}">
          <div>${post.user.email}</div>
        </div>
        <img src="${serverURL}${post.imageSrc}" class="card-img-top" alt="${post.title}">
        <div class="card-body">
        <div class="card-bottom-section">
        <h5 class="card-title">${post.title}</h5>
        </div>
        <p class="card-text">${post.description}</p>
        </div>
        <p class="card-text" style="text-align: end;"><small class="text-muted">${new Date(post.date).toLocaleDateString()}</small></p>
        `
        postsContainer.append(postCard);
      });
      
      this.contentContainer.append(postsContainer);
    }
  };

};
