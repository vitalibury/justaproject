export default class Router {

    constructor() {}

    goTo = (path) => {
        window.location.hash = path;
    };

};