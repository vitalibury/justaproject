import DataService from "./data-service.js";
import PushNotifications from "./push-notification.js";
import notificationsList from "./notifications-list.js";
import modes from "./modes.js";
import utils from "./utils.js";


export default class Router {

    dataService = null;
    notification = null;
    header = null;
    contentContainer = null;
    menuButtons = [];

    constructor() {
        this.contentContainer = mainContent;
        this.dataService = new DataService();
        this.notification = new PushNotifications();
        this.menuButtons = [...utils.findPageElements('.menu-btn')];
    }

    goTo = (path) => {
        window.location.hash = path;
    };

    renderParticularPage = () => {
        const currentMode = utils.findExistingMode(modes);
        utils.hideElement(this.contentContainer);
        switch (currentMode) {
            case 'usersTable':
            case 'userEdit':
            case 'userPosts':
            case 'newPost':
            case 'comments':
                this.setActiveMenuItem();
                setTimeout(() => {
                    this.dataService.appAuthorization ? modes[currentMode]() : this.redirectToAuthorization();
                }, 300);
                break;      
            default:
                this.setActiveMenuItem();
                setTimeout(() => {
                    modes[currentMode]();
                }, 300);
                break;
        };
    };

    redirectToAuthorization = () => {
        this.goTo('');
        this.notification.showPushNotification(notificationsList.signIn, 'alert-warning');
      };

      setActiveMenuItem = () => {
        this.menuButtons.forEach(el => el.classList.remove('active'));
        const activeButton = this.menuButtons.find(el => el.hash === window.location.hash);
        activeButton ? activeButton.classList.add('active') : null;
      };

      logout = () => {
        this.dataService.appAuthorization = false;
        this.goTo('');
      };

};