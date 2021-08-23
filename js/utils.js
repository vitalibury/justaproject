export const clearElementContent = (element) => {
  element.innerHTML = "";
};

export const findPageElement = (selector) => {
  const element = document.querySelector(selector);
  return element;
};

export const findPageElements = (selector) => {
  const elementsCollection = document.querySelectorAll(selector);
  return elementsCollection;
};

export const getFormElement = (form, elementName) => {
  if (typeof elementName === "string") {
    return form.elements[elementName];
  }
};

export const testWithRegExp = (reg, str) => {
  if (typeof str === "string" && str.length > 0) {
    return reg.test(str);
  }
  return false;
};

export const runThroughCheckList = (checkList, value) => {
  return checkList.every(check => check(value));
};

export const inputFocusHandler = (e) => {
  e.target.previousElementSibling.classList.add('on-focus');
};

export const inputBlurHandler = (e) => {
  const container = e.target.closest('.form-group');
  const fieldValue = e.target.value;
  if (!container.classList.contains('has-error') && !fieldValue) {
    e.target.previousElementSibling.classList.remove('on-focus');
  };
};

export const focusInputLabel = (input) => {
  input.previousElementSibling.classList.add('on-focus');
};

export const showElement = (element) => {
  element.classList.remove('hide');
};

export const hideElement = (element) => {
  element.classList.add('hide');
};

export const showOverlay = () => {
  overlay.classList.remove('hide-overlay');
};

export const hideOverlay = () => {
  overlay.classList.add('hide-overlay');
};

export const showPopup = () => {
  const popup = findPageElement('.popup');
  popupContent.classList.remove('hide-popup');
};

export const hidePopup = () => {
  const popup = findPageElement('.popup');
  popup.classList.add('hide-popup');
};

export const clearRoute = (route) => {
  return route.split('').splice(1).join('');
}

export const isAuthorized = () => {
  return sessionStorage.getItem('isAuthorized');
}
