import { testWithRegExp } from "./utils.js";

export const validatorsList = {
  'required': (value) => !!(value.length === 0),
  'min-length': (value, param) => !!(value.length < param),
  'max-length': (value, param) => !!(value.length > param),
   'is-email': (value) => !(testWithRegExp(
    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
    value
   )),
   'min-digits': (value) => !(testWithRegExp(/\d\w{0,8}\d/, value))
};

export const validateFormField = (input) => {
  const elementValidators = [];
  const container = input.closest('.form-group');
  const fieldValue = input.value.trim();
  let inputMessage = 'valid';

  if (input.dataset.validators) {
    input.dataset.validators.split(',')
    .forEach(validator => {
      const validatorStr = validator.trim();
      const name = validatorStr.split('(')[0];
      const param = validatorStr.split(/[()]/)[1];
      elementValidators.push({
        name,
        param
      });
    });

    elementValidators.forEach(validator => {
      container.classList.remove('has-error');
      container.classList.remove(`error--${validator.name}`);

      if(validatorsList[validator.name](fieldValue, validator.param)) {
        inputMessage = `error--${validator.name}`;
      };
    });

    if (inputMessage !== 'valid') {
      container.classList.add('has-error');
      container.classList.add(inputMessage);
      container.classList.remove('error--not-equal');
    };
  };
  return inputMessage === 'valid';

};


export const validateFormsEqual = (input, secondInput) => {
  const secondContainer = secondInput.closest('.form-group');  
  secondContainer.classList.remove('has-error');
  secondContainer.classList.remove('error--not-equal');

  if (input.value.trim() !== secondInput.value.trim()) {
    secondContainer.classList.add('has-error');
    secondContainer.classList.add('error--not-equal');
    return false;
  };

  return true;

};





// export const checkFunctions = {
//   forEmail: [emailFormat],
//   forPassword: [passwordLengthWithLettersAndDigits, multipleDigits],
// };

// function emailFormat(email) {
//   return testWithRegExp(
//     /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
//     email
//   );
// };

// function passwordLengthWithLettersAndDigits(pass) {
//   return testWithRegExp(/^\w{3,10}$/, pass);
// };

// function multipleDigits(pass) {
//   return testWithRegExp(/\d\w{0,8}\d/, pass);
// };