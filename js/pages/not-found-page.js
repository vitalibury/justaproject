import modes from "../modes.js";
import utils from "../utils.js";


export default class PageNotFound {

    contentContainer = null;
    layout = null;

    constructor() {
        this.contentContainer = mainContent;
        this.layout = pageNotFound;
        modes['404'] = this.renderNotFoundPage;
    }

    renderNotFoundPage = () => {   
        this.contentContainer.innerHTML = this.layout.innerHTML;
        utils.showElement(this.contentContainer);
    };
};
