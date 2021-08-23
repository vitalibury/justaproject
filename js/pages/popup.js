import { hideOverlay, hidePopup } from "../utils.js";

export default class Popup {

    layout = null;

    constructor() {
        // this.layout = popupContent;
    }

    // renderPopup(target) {
    //     target.innerHTML = this.layout.innerHTML;
    // };

    closePopup() {
        const cancelBtn = document.querySelector('.btn-popup-cancel');

        cancelBtn.addEventListener('click', () => {
            hideOverlay();
            hidePopup();
        });
    };

}