const utils = {
  clearElementContent (element) {
    element.innerHTML = "";
  },
  
  findPageElement (selector){
    const element = document.querySelector(selector);
    return element;
  },
  
  findPageElements (selector) {
    const elementsCollection = document.querySelectorAll(selector);
    return elementsCollection;
  },
  
  getFormElement (form, elementName) {
    if (typeof elementName === "string") {
      return form.elements[elementName];
    };
  },
  
  testWithRegExp (reg, str) {
    if (typeof str === "string" && str.length > 0) {
      return reg.test(str);
    };
    return false;
  },
  
  runThroughCheckList (checkList, value) {
    return checkList.every(check => check(value));
  },
  
  inputFocusHandler (e) {
    e.target.previousElementSibling.classList.add('on-focus');
  },
  
  inputBlurHandler (e) {
    const container = e.target.closest('.form-group');
    const fieldValue = e.target.value;
    if (!container.classList.contains('has-error') && !fieldValue) {
      e.target.previousElementSibling.classList.remove('on-focus');
    };
  },
  
  focusInputLabel (input) {
    input.previousElementSibling.classList.add('on-focus');
  },
  
  showElement (element) {
    element.classList.remove('hide');
  },
  
  hideElement (element) {
    element.classList.add('hide');
  },
  
  showOverlay () {
    overlay.classList.remove('hide-overlay');
  },
  
  hideOverlay () {
    overlay.classList.add('hide-overlay');
  },
  
  showPopup () {
    const popup = findPageElement('.popup');
    popupContent.classList.remove('hide-popup');
  },
  
  hidePopup () {
    const popup = findPageElement('.popup');
    popup.classList.add('hide-popup');
  },
  
  clearRoute (route) {
    return route.split('').splice(1).join('');
  },
  
  isAuthorized () {
    return sessionStorage.getItem('isAuthorized');
  }

};

export default utils;
