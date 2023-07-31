/**
 * Adds a new user to the system based on the input provided in the registration form.
 * It performs the following operations:
 * 1. Retrieves the name, email, and password input elements from the registration form.
 * 2. Checks if the email is already registered. If so, it handles the error and stops further execution.
 * 3. Hashes the password using the SHA-256 algorithm asynchronously.
 * 4. Generates a new user object with the provided name, lowercase email, hashed password, initials, random color,
 *    and a generated ID.
 * 5. Adds the new user to the user list.
 * 6. Shows a success message indicating that the user has been added.
 * 7. Redirects to the login page after a delay of 3 seconds.
 */
async function addUser() {
    let nameInput = document.getElementById('register-name');
    let emailInput = document.getElementById('register-email').value;
    let passwordInput = document.getElementById('register-password');
    if (isEmailAlreadyRegistered(emailInput.value)) {
        handleEmailAlreadyRegisteredError(nameInput, emailInput, passwordInput);
        return;
    }
    let hashedPassword = await hashWithSHA256(passwordInput.value);
    let genId = users.length
    let newUser = { id: genId,name: nameInput.value, mail: emailInput.toLowerCase(), password: hashedPassword.toString(), initials: getInitial(nameInput.value), color: getRandomColor(), phone: 'not set'};
    addNewUser(newUser);
    showSuccessMessage();
    setTimeout(goToLogin, 3000);
}

/**
 * Checks if an email is already registered in the system.
 *
 * @param {string} email - The email to check.
 * @returns {boolean} Returns true if the email is already registered, otherwise returns false.
 */
function isEmailAlreadyRegistered(email) {
    return users.some(user => user.mail === email);
}

/**
 * Handles the error when an email is already registered by performing the following actions:
 * 1. Displays the error message element with the ID 'register-error'.
 * 2. Clears the values of the name, email, and password input elements.
 * 3. Sets a timeout to hide the 'register-error' message after 3 seconds.
 *
 * @param {HTMLInputElement} nameInput - The name input element.
 * @param {HTMLInputElement} emailInput - The email input element.
 * @param {HTMLInputElement} passwordInput - The password input element.
 */
function handleEmailAlreadyRegisteredError(nameInput, emailInput, passwordInput) {
    let errorMessage = document.getElementById('register-error');
    errorMessage.style.display = 'block';
    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    setTimeout(hideMailAlreadyUsed, 3000);
}

/**
 * Adds a new user to the system by performing the following operations:
 * 1. Pushes the new user object to the 'users' array.
 * 2. Saves the updated 'users' array to the server using the 'setItem' function.
 *
 * @param {object} newUser - The new user object to be added.
 */
async function addNewUser(newUser) {
    users.push(newUser);
    await setItem('users', JSON.stringify(users));
}

/**
 * Displays the success message element with the ID 'register-success' by setting its display property to 'block'.
 */
function showSuccessMessage() {
    const successMessage = document.getElementById('register-success');
    successMessage.style.display = 'block';
}

/**
 * Redirects the user to the login page by changing the window location to "index.html".
 */
function goToLogin() {
    window.location.href = "index.html"
}

/**
 * The function returns the first letter of the first name and last name.
 * If the last name does not exist, then only the first letter of the first name is output
 * @example
 * getInitial('Max Mustermann');
 * @returns {String} MM
 * @param {String} username The name of the person you want to get the initials of.
 * @returns first letter of the first name and last name or only the first letter of the first name.
 * 
 */
function getInitial(username) {
    if (username.includes(' ')) {
        return username.charAt(0).toUpperCase() + username.charAt(username.lastIndexOf(' ') + 1).toUpperCase();
    } else {
        return username.charAt(0).toUpperCase();
    }
}

/**
 * Generates a random color in hexadecimal format.
 *
 * @returns {string} A randomly generated color in the format '#RRGGBB', where RR, GG, and BB are two-digit hexadecimal values.
 */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Hides the element with the ID 'register-error' by setting its display property to 'none'.
 */
function hideMailAlreadyUsed() {
    document.getElementById('register-error').style.display = 'none';
}