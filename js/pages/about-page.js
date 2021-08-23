export default class About {

    layout = null;

    constructor() {
        this.layout = about;
    }

    renderAboutPage = (target) => {   
        target.innerHTML = this.layout.innerHTML;
    };
};
