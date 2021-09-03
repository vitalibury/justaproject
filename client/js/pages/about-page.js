import modes from "../modes.js";
import utils from "../utils.js";


export default class About {

    contentContainer = null;
    layout = null;

    constructor() {
        this.contentContainer = mainContent;
        this.layout = about;
        modes['about'] = this.renderAboutPage;
    }

    renderAboutPage = () => {   
        this.contentContainer.innerHTML = this.layout.innerHTML;
        utils.showElement(this.contentContainer);
    };
};
