let isRememberme = localStorage.getItem('rememberMeChecked');

window.addEventListener('load', function() {
    if (currentUser) {
        goToSummary();
      } 
    remember();
});

/**
 * Checks if the "Remember Me" option is enabled and loads the saved login data if true.
 */
function remember() {
    if(isSavedRememberMe()) {
        loadLoginData();
    }
}

/**
 * Checks if the "Remember Me" option is saved.
 * @returns {boolean} True if the "Remember Me" option is saved, false otherwise.
 */
function isSavedRememberMe() {
    if(isRememberme == 'true') {
        return true;
    }else return false;
}

/**
 * Loads the saved login data into the login form if the "Remember Me" option is checked.
 */
function loadLoginData() {
    let storedEmail = localStorage.getItem("login-email");
    let storedPassword = localStorage.getItem("login-password");
    let rememberMe = document.querySelector('input[name="remember-me"]');
    let rememberMeChecked = localStorage.getItem("rememberMeChecked");
    rememberMeChecked = rememberMeChecked === "true";
    if (storedEmail && storedPassword && rememberMeChecked) {
        document.getElementById("email").value = storedEmail;
        document.getElementById("password").value = storedPassword;
        rememberMe.checked = true;
    }
}

/**
 * Login Function including hashed Password and remember me functionality
 */
async function login() {
    let email = document.getElementById('email').value.toLowerCase();
    let password = document.getElementById('password').value;
    let rememberMe = document.querySelector('input[name="remember-me"]').checked;
    let user = users.find(u => u.mail == email);
    if (user && await isPasswordValid(password, user.password)) {
        handleLoginSuccess(email, password, rememberMe, user);
    } else {
        handleLoginFailure();
    }
}

/**
 * Checks if the provided password matches the hashed password.
 * @param {string} password - The password to be checked.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} True if the password is valid, false otherwise.
 */
async function isPasswordValid(password, hashedPassword) {
    if(!isSavedRememberMe()){
        return await hashWithSHA256(password) === hashedPassword;
    }else {
        return password === localStorage.getItem('login-password').toString();
    }
}

/**
 * Handles the actions to be performed after a successful login.
 * @param {string} email - The email address used for login.
 * @param {string} password - The password used for login.
 * @param {boolean} rememberMe - Indicates whether the "Remember Me" option was selected.
 * @param {object} user - The user object containing user information.
 */
async function handleLoginSuccess(email, password, rememberMe, user) {
    if (rememberMe) {
       await saveLoginData(email, password);
    } else {
        clearLoginData();
    }
    setCurrentUser(user);
    goToSummary();
}

/**
 * Performs a guest login.
 * Sets the current user as the guest user and navigates to the summary page.
 */
function guestLogin() {
    let guest = users.find(u => u.name == 'Guest');
    setCurrentUser(guest);
    goToSummary();
}

/**
 * Handles the actions to be performed after a login failure.
 * Displays a login failure message.
 */
function handleLoginFailure() {
    showLoginFailureMessage();
}

/**
 * Sets the current user by creating a cookie with the user's name.
 * @param {Object} user - The user object.
 */
function setCurrentUser(user) {
    createCookie("currentUser", user.name, 1);
}

/**
 * Displays the login failure message to the user.
 */
function showLoginFailureMessage() {
    document.getElementById('login-false').style.display = 'block';
    setTimeout(hideFalseData, 9000);
}

/**
 * Clears the login fields by setting their values to an empty string.
 */
function clearLoginFields() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}

/**
 * hide "false Login" Message
 */
function hideFalseData() {
    document.getElementById('login-false').style.display = 'none';
}

/**
 * go to Page and save status in local storage for bg
 */
function goToSummary() {
    window.location.href = 'summary.html';
    setNav('summaryNav');
}

/**
 * Clears the login data stored in the local storage.
 */
function clearLoginData() {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("rememberMeChecked");
}

/**
 * Saves the login data to the local storage.
 * @param {string} email - The user email.
 * @param {string} password - The user password.
 */
async function saveLoginData(email, password) {
    let pwdHash = await hashWithSHA256(password);
    localStorage.setItem("login-email", email);
    localStorage.setItem("login-password", pwdHash.toString());
    localStorage.setItem("rememberMeChecked", true);
}

/**
 * Creates a cookie with the specified name, value, and expiration.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} expiration - The number of days until the cookie expires.
 */
function createCookie(name, value, expiration) {
    let expires = new Date();
    expires.setHours(5, 0, 0, 0); // Setze die Ablaufzeit auf 5 Uhr
    if (expiration) {
      expires.setDate(expires.getDate() + expiration); // Füge die Anzahl der Tage hinzu
    }  
    let cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    cookie += "; expires=" + expires.toUTCString();
    cookie += "; path=/";  
    document.cookie = cookie;
  }
  
  