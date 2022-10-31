
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
  console.log('login part');
  
  try {
    
    // Axios is used to redirect to our created Api with login credentials
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/users/login',
      headers:{
        "Content-Type": "application/json"
      },
      data: {
        email,
        password,
      },
    });
    console.log(res);
    
    if (res.data.status === 'success') {
      showAlert('success', 'logged in Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
const signUp = async (userName, email, password, passwordConfirm) => {
  console.log(userName, email, password);
  try {
    // Axios is used to redirect to our created Api with login credentials
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/users/signup',
      headers:{
        "Content-Type": "application/json"
      },
      data: {
        name: userName,
        email,
        password,
        passwordConfirm
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
    showAlert('error', err.response.data.message);
  }
};
const addNewUser = async (name, email, DOB, city, country, about, password, passwordConfirm) => {
  console.log(name, email, DOB, city, country, about, password, passwordConfirm);
  try {
    // Axios is used to redirect to our created Api with login credentials
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/users/addUser',
      headers:{
        "Content-Type": "application/json"
      },
      data: {
        name,
        email,
        DOB,
        city,
        country,
        about,
        password,
        passwordConfirm
      },
    });
    
    if (res.data.status === 'success') {
      showAlert('success', 'User Added Successfully');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
    // console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/users/logout',
      headers:{
        "Content-Type": "application/json"
      },
    });

    if ((res.data.status === 'success')) {
      showAlert('success', 'logging out');
      location.reload(true);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
const updateData = async (name, email, role) => {
  console.log(name, email, role);
  try {
    
    // Axios is used to redirect to our created Api with login credentials
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:8000/api/users/updateMe',
      headers:{
        "Content-Type": "application/json"
      },
      data: {
        name,
        email,
        role,
      },
    });
    console.log(res);
    
    if (res.data.status === 'success') {
      showAlert('success', 'Data Updated Successfully');
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
const addNewMovie = async (title, year, runtime, plot, genre, language, country, poster, imdbRating, type) => {
  console.log(title, year, runtime, genre, language, country, poster, imdbRating, type);
  try {
    // Axios is used to redirect to our created Api with login credentials
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/movies',
      headers:{
        "Content-Type": "application/json"
      },
      data: {
        title,
        year,
        runtime,
        plot,
        genre,
        language,
        country,
        poster,
        imdbRating,
        type
      },
    });
    
    if (res.data.status === 'success') {
      showAlert('success', 'Movie Added Successfully');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
    // console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};



const loginForm = document.querySelector('.loginForm');
const signUpForm = document.querySelector('.signUpForm');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const NewUser = document.querySelector('.add-User');
const NewMovie = document.querySelector('.movie-data');


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
    console.log(userName, email, password, passwordConfirm);
    signUp(userName,email, password, passwordConfirm);
  });
}
if (NewUser) {
  NewUser.addEventListener('submit', (e) => {
    // this prevent the User from reload any Other page
    e.preventDefault();
    //   we used the value property in order to read that value
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const DOB = document.getElementById('DOB').value;
    const city = document.getElementById('city').value;
    const country = document.getElementById('country').value;
    const about = document.getElementById('about').value;
    
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    console.log(name, email, DOB, city, country, about, password, passwordConfirm);
    addNewUser(name, email, DOB, city, country, about, password, passwordConfirm);
  });
}
if (NewMovie) {
  NewMovie.addEventListener('submit', (e) => {
    // this prevent the User from reload any Other page
    e.preventDefault();
    //   we used the value property in order to read that value
    const title = document.getElementById('title').value;
    const year = document.getElementById('year').value;
    const runtime = document.getElementById('runtime').value;
    const genre = document.getElementById('genre').value;
    const plot = document.getElementById('plot').value;
    const language = document.getElementById('language').value;
    const country = document.getElementById('country').value;
    const poster = document.getElementById('poster').value;
    const imdbRating = document.getElementById('imdbRating').value;
    const type = document.getElementById('type').value;
    
    console.log(title, year, runtime, plot, genre, language, country, poster, imdbRating, type);
    addNewMovie(title, year, runtime, plot, genre, language, country, poster, imdbRating, type);
  });
}
if(userDataForm){
  userDataForm.addEventListener('submit', (e) => {
    // this prevent the User from reload any Other page
    e.preventDefault();
    //   we used the value property in order to read that value
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    console.log(name, email, role);
    updateData(name,email, role);
  });
}
