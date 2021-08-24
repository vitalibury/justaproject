import utils from '../utils.js';

export default class RegistrationForm {

  constructor() {
    this.layout = registrationForm;
  }

  renderRegistrationForm = (target) => {
    target.innerHTML = this.layout.innerHTML;
  };

  defineRegistrationForm = () => {
    const registrationForm = utils.findPageElement(".registration-form");
    return registrationForm;
  };

};


//




// export const addRegistrationForm = (target, method) => {
//   const registrationFormHtml = `
//     <form class='card registration-form'>
//   <h5 class='card-title'>Регистрация:</h5>
//   <div class='card-body'>
//     <div class='mb-3'>
//       <label for='email' class='form-label'>Введите email:</label>
//       <input
//         type='email'
//         id='email'
//         name='email'
//         placeholder='example@mail.com'
//         class='form-control'
//         required
//       />
//     </div>

//     <div class='mb-3'>
//       <label for='password' class='form-label'>Введите пароль:</label>
//       <input
//         type='password'
//         id='password'
//         name='password'
//         class='form-control'
//         autocomplete='off'
//         maxlength='10'
//         required
//       />
//     </div>

//     <div class='mb-3'>
//       <label for='passwordRepeat' class='form-label'>Повторите пароль:</label>
//       <input
//         type='password'
//         id='passwordRepeat  '
//         name='passwordRepeat'
//         class='form-control'
//         autocomplete='off'
//         maxlength='10'
//         required
//       />
//     </div>

//     <button type='submit' class='btn btn-primary registration-submit-btn'>
//       Зарегистрироваться
//     </button>
//   </div>
// </form>
//     `;

//   target.insertAdjacentHTML(method, registrationFormHtml);
// };

// export const defineRegistrationSubmitBtn = () => {
//   const submitButton = findPageElement(".registration-submit-btn");
//   return submitButton;
// };

// export const createUser = (email, password) => {
//   localStorage.setItem(`isSoftGramEmail_${email}`, email);
//   localStorage.setItem(`isSoftGramPass_${password}`, password);
// };