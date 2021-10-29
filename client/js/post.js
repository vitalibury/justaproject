import DataService from "./data-service.js";
import Router from "./router.js";
// import modes from "./modes.js";
import utils from "./utils.js";
import { serverURL } from "./config/app-keys.js";

export default class Post {
  dataService = null;
  router = null;

  constructor() {
    this.dataService = new DataService();
    this.router = new Router();
  }

  createPost = (post) => {
    const postCard = document.createElement("div");
    postCard.classList.add("card");
    postCard.classList.add("mb-3");
    postCard.innerHTML = `
        <div class="card-header post-header">
        <img src="${serverURL}${post.user.avatar}" class="post-avatar" alt="${post.user.email}">
        <div class="post-author">${post.user.email}</div>
        </div>
        <img src="${serverURL}${post.imageSrc}" class="card-img-top" alt="${post.title}">
        <div class="post-rating" data-postId='${post._id}'>
        ${this.renderPostRating(post)}
        </div>
        <div class="card-body">
        <div class="card-bottom-section">
        <h5 class="card-title">${post.title}</h5>
        </div>
        <p class="card-text">${post.description}</p>
        </div>
        <p class="card-text post-info"><small class="text-muted">${utils.convertDate(post.date)}</small></p>
        `;
    return postCard;
  };

  renderPostRating = (post) => {
    const ratingSrc = post.isRated // (like => like.user._id === this.dataService.appAuthorization) ?
      ? `./assets/images/like.svg`
      : `./assets/images/empty_like.svg`;
    let ratedUsersElements = "";
    if (post.likesAmount) {
      // utils.shuffleArray(post.likes).slice(0, 5)
      post.likes.forEach((like) => {
        ratedUsersElements += `<img src="${like.user.avatar}" class="rated-user" alt="${like.user.email}">`;
      });
    }
    return `
    <img src="${ratingSrc}" class="rate-post-btn" alt="rating">
    <div class="rated-amount">${
      post.likesAmount ? post.likesAmount : ""
    }</div>
    <div class="rated-users">${ratedUsersElements}</div>
    `;
  };

  handlePostRate = (postRating) => {
    if (this.dataService.appAuthorization) {
      this.dataService
        .changePostRate(
          postRating.dataset.postid,
          this.dataService.appAuthorization
        )
        .then((post) => {
          console.log(post)
          utils.clearElementContent(postRating);
          postRating.innerHTML = this.renderPostRating(post);
        })
        .catch((e) => console.log(e));
    } else {
      this.router.redirectToAuthorization();
    }
  };
}
