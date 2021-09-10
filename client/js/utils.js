const utils = {
  clearElementContent(element) {
    element.innerHTML = "";
  },

  findPageElement(selector) {
    const element = document.querySelector(selector);
    return element;
  },

  findPageElements(selector) {
    const elementsCollection = document.querySelectorAll(selector);
    return elementsCollection;
  },

  getFormElement(form, elementName) {
    if (typeof elementName === "string") {
      return form.elements[elementName];
    }
  },

  testWithRegExp(reg, str) {
    if (typeof str === "string" && str.length > 0) {
      return reg.test(str);
    }
    return false;
  },

  runThroughCheckList(checkList, value) {
    return checkList.every((check) => check(value));
  },

  handleInputFocus(e) {
    e.target.previousElementSibling.classList.add("on-focus");
  },

  handleInputBlur(e) {
    const container = e.target.closest(".form-group");
    const fieldValue = e.target.value;
    if (!container.classList.contains("has-error") && !fieldValue) {
      e.target.previousElementSibling.classList.remove("on-focus");
    }
  },

  focusInputLabel(input) {
    input.previousElementSibling.classList.add("on-focus");
  },

  showElement(element) {
    element.classList.remove("hide");
  },

  hideElement(element) {
    element.classList.add("hide");
  },

  showOverlay() {
    overlay.classList.remove("hide-overlay");
  },

  hideOverlay() {
    overlay.classList.add("hide-overlay");
  },

  showPopup() {
    const popup = this.findPageElement(".popup");
    popup.classList.remove("hide-popup");
  },

  hidePopup() {
    const popup = this.findPageElement(".popup");
    popup.classList.add("hide-popup");
  },

  clearRouteHash() {
    return window.location.hash.split("").splice(1).join("");
  },

  getModeFromHash() {
    return this.clearRouteHash().split("/")[0];
  },

  findExistingMode(modes) {
    const defaultMode = "404";
    const currentMode = Object.keys(modes).find(
      (mode) => mode === this.getModeFromHash()
    );
    return currentMode === undefined ? defaultMode : currentMode;
  },

  getRouteParameter(number) {
    return this.clearRouteHash().split("/")[number];
  },

  handleResponse(response) {
    return new Promise((resolve, reject) => {
      if (response.ok) {
        resolve(response.json());
      } else {
        reject(response.json());
      }
    });
  },

  renderSpinner() {
    mainContent.innerHTML = `
    <div class="spinner-border text-info" style="width: 4rem; height: 4rem; border-width: 0.5rem;" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div>Загружаю данные...</div>
    `;
  },
};

export default utils;
