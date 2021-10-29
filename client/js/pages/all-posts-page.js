import Post from "../post.js";
import modes from "../modes.js";
import utils from "../utils.js";


export default class AllPosts extends Post {

  contentContainer = null;

  constructor() {
    super();
    this.contentContainer = mainContent;
    modes['posts'] = this.renderAllPostsPage;
  }

  renderAllPostsPage = () => {
    utils.clearElementContent(this.contentContainer);
    utils.renderSpinner(this.contentContainer);
    utils.showElement(this.contentContainer);
    this.dataService.getAllPosts(this.dataService.appAuthorization)
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
      posts.forEach(post => {
        const postCard = this.createPost(post);
        const commentsLink = document.createElement('a');
        commentsLink.href = `/#comments/${post._id}`;
        commentsLink.innerText = "Go to the comments";
        postCard.append(commentsLink);
        postsContainer.append(postCard);
      });
      
      this.contentContainer.append(postsContainer);
    }
  };
  
};
