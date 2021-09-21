import DataService from "../data-service.js";
import utils from "../utils.js";


export default class Posts {

  dataService = null;
  contentContainer = null;

  constructor() {
    this.dataService = new DataService();
    this.contentContainer = mainContent;
  }

  renderPostsPage = () => {
    utils.clearElementContent(this.contentContainer);
    this.contentContainer.innerHTML = this.layout.innerHTML;
    // this.postsContainer = userPostsContainer;
    // utils.renderSpinner(this.postsContainer);
    // utils.showElement(this.contentContainer);
  };

};
