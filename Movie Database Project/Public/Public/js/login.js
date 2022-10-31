
const hideAlert = () => {
  // select the element with the alert class
  const el = document.querySelector('.alert');
  //   in basic javascript we can mavo one level up and then remove the child class that is exactly we r doing below
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markUp = `<div class="alert alert--${type}">${msg}</div>`;
  //   below select the body and in that section insert our alert block
  document.querySelector('body').insertAdjacentHTML('afterbegin', markUp);
  //   after the alert i also want to hide all the alert after 5 sec
  window.setTimeout(hideAlert, 5000);
};


// module is diffenent in javascript and in nodejs
const login = async (email, password) => {
  console.log(email, password);
  try {
    
    // Axios is used to redirect to our created Api with login credentials
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/login',
      data: {
        email,
        password,
      },
    });
    console.log(res.status);
    
    if (res.data.status === 'success') {
      showAlert('success', 'logged in Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Logged In Credentials are wrong');
  }
};

const signUp = async (userName, email, password) => {
  console.log(userName, email, password);
  try {
    // Axios is used to redirect to our created Api with login credentials
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/signUp',
      data: {
        userName,
        email,
        password,
      },
    });
    
    if (res.data.status === 'success') {
      showAlert('success', 'Sing Up Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    // console.log(res);
  } catch (err) {
    showAlert('error', err.message);
  }
};



const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/logout',
    });

    if ((res.data.status = 'success')) {
      showAlert('success', 'logging out');
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};


const loginForm = document.querySelector('.loginForm');
const signUpForm = document.querySelector('.signUpForm');
const logOutBtn = document.querySelector('.nav__el--logout');

console.log('hello from the client side');


if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    // this prevent the User from reload any Other page
    e.preventDefault();
    //   we used the value property in order to read that value
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password);
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (signUpForm) {
  signUpForm.addEventListener('submit', (e) => {
    // this prevent the User from reload any Other page
    e.preventDefault();
    //   we used the value property in order to read that value
    const userName = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    console.log(email, password);
    signUp(userName,email, password);
  });
}


