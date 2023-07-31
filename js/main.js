let users;
let tasks;
let categorys;
let contacts;
let currentUser;
let script = document.createElement("script");

/**
 * Loads the required data from the storage.
 */
async function loadRequiredData() {
    users = JSON.parse(await getItem('users'));
    tasks = JSON.parse(await getItem('tasks'));
    categorys = JSON.parse(await getItem('categorys'));
    contacts = JSON.parse(await getItem('users'));
}

/**
 * Includes HTML content into elements with 'w3-include-html' attribute.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    setNavActiv();
}

/**
 * Sets the value of the 'nav' item in the localStorage.
 *
 * @param {string} name - The name of the navigation item.
 */
function setNav(name) {
    localStorage.setItem('nav', name);    
}

/**
 * Sets the 'nav-activ' class on the navigation item specified in localStorage,
 * if the current page is not the index page.
 */
function setNavActiv() {
    if(!onIndex()){
        let id = localStorage.getItem('nav');
        document.getElementById(id).classList.add('nav-activ');
    }    
}

/**
 * An event listener that executes the specified function when the window has finished loading.
 * The function performs the following operations:
 * 1. Calls the 'loadRequiredData' function asynchronously.
 * 2. Invokes the 'includeHTML' function.
 * 3. Retrieves the value of the "currentUser" cookie.
 * 4. Checks if the "currentUser" is falsy and the current page is not the index page.
 *    If both conditions are met, it redirects the user to the 'index.html' page.
 */
window.addEventListener('load', async function () {
    await loadRequiredData();
    includeHTML();
    currentUser = getCookieValue("currentUser");
    if (!currentUser && !onIndex()) {
        window.location.href = 'index.html';
    }

});

/**
 * Checks if the current page is the index page or specific related pages.
 *
 * @returns {boolean} Returns true if the current page is the index page or related pages ('index.html', 'forgotpassword.html', 'signup.html').
 *                    Otherwise, returns false.
 */
function onIndex() {
    const url = document.URL;
    const last = url.split("/");
    const position = (last.length -1);
    if (last[position] === 'index.html' || last[position] === 'forgotpassword.html' || last[position] === 'signup.html') {
        return true;
    }
}

/**
 * Retrieves the value of a cookie by its name.
 *
 * @param {string} name - The name of the cookie.
 * @returns {string|null} The value of the cookie if found, or null if the cookie does not exist.
 */
function getCookieValue(name) {
    var encodedName = encodeURIComponent(name) + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(";");
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].trim();
        if (cookie.indexOf(encodedName) === 0) {
            return cookie.substring(encodedName.length, cookie.length);
        }
    }
    return null;
}

/**
 * Opens the "Add Task" section by generating HTML, removing the 'd-none' class from the element with the ID 'addTask',
 * and adding the 'overflow' class to the document body.
 */
function openAddTask() {
    genHtmlAddTask();
    document.getElementById('addTask').classList.remove('d-none');
    document.body.classList.add('overflow');
}

/**
 * Deletes a cookie by setting its expiration date to a date in the past.
 *
 * @param {string} name - The name of the cookie to be deleted.
 */
function deleteCookie(name) {
    let expires = new Date();
    expires.setTime(expires.getTime() - 1);

    let cookie = encodeURIComponent(name) + "=; expires=" + expires.toUTCString();
    cookie += "; path=/";

    document.cookie = cookie;
}

/**
 * Sets the value of an item in the server using a POST request.
 *
 * @param {string} key - The key of the item.
 * @param {any} value - The value of the item.
 * @returns {Promise<object>} A Promise that resolves to the response JSON object from the server.
 */
async function setItem(key, value) {
    const payload = { key, value, token: TOKEN };
    return fetch(URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
 * Retrieves the value of an item from the server using a GET request.
 *
 * @param {string} key - The key of the item.
 * @returns {Promise<any>} A Promise that resolves to the value of the item retrieved from the server.
 * @throws {string} Throws an error if the item with the specified key is not found.
 */
async function getItem(key) {
    const url = `${URL}?key=${key}&token=${TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        // Verbesserter code
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}

/**
 * Toggles the visibility of the element with the ID 'logout' by adding or removing the 'd-none' class.
 */
function showLogout() {
    document.getElementById('logout').classList.toggle('d-none');
}

/**
 * Logs out the user by deleting the 'currentUser' cookie and redirecting to the 'index.html' page.
 */
function logout() {
    deleteCookie('currentUser');
    window.location.href = 'index.html';
}

/**
 * Generates the HTML content for the "Add Task" section and replaces the content of the element with the ID 'addTask'.
 * The generated HTML includes form inputs for title, description, category, assigned to contacts, due date, priority,
 * and subtasks.
 */
function genHtmlAddTask() {
    document.getElementById('addTask').innerHTML = /*html */`    
    <div class="add-task-container">
            <div class="head">
                <h3>Add Task</h3>
                <img src="./assets/images/close.png" alt="" id="close-add-task" onclick="closeWindow('addTask')">
            </div>
            <form action="#">
                <div class="left">
                    <div class="input-box">
                        <p class="title">Title</p>
                        <input type="text" placeholder="Enter a title" class="input">
                    </div>
                    <div class="input-box">
                        <p class="title">Description</p>
                        <textarea class="input" name="description" id="description" placeholder="Enter a Description"></textarea>
                    </div>
                    <div class="input-box">
                        <p class="title">Category</p>
                        <select name="category" id="category" class="input bla">
                            <option value="">Category 1</option>
                            <option value="">Category 2</option>
                            <option value="">Category 4</option>
                            <option value="">Category 5</option>
                        </select>
                    </div>
                    <div class="input-box">
                        <p class="title">Assigned to</p>
                        <div class="dropdown">
                            <div class="dropdown-toggle" type="button" onclick="toggleDropdown()">
                                Select contacts to assign
                            </div>
                            <div class="dropdown-menu" id="dropdownMenu">
                                <div class="dropdown-list">
                                    <div><label><input type="checkbox" value="person1"> Person 1</label></div>
                                    <div><label><input type="checkbox" value="person2"> Person 2</label></div>
                                    <div><label><input type="checkbox" value="person3"> Person 3</label></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="center"></div>
                <div class="right">
                    <div class="input-box">
                        <p class="title">Due Date</p>
                        <input type="date" placeholder="dd/mm/yy" class="input">
                    </div>
                    <div class="input-box">
                        <p class="title">Prio</p>
                        <div class="prio-btns">
                            <div class="prio-btn"> Urgemt <img src="./assets/images/prioUrgent.png" alt=""></div>
                            <div class="prio-btn"> Medium <img src="./assets/images/prioMedium.png" alt=""></div>
                            <div class="prio-btn"> Low <img src="./assets/images/prioLow.png" alt=""></div>
                        </div>
                    </div>
                    <div class="input-box">
                        <p class="title">Subtasks</p>
                        <input type="text" class="subtasks-input input">
                    </div>
                </div>

            </form>
        </div>    
    `;
}

/**
 * Prevents the event from propagating further.
 * @param {Event} event - The event object.
 */
function noClose(event) {
    event.stopPropagation();
}

/**
 * Hashes the input string using the SHA-256 algorithm.
 *
 * @param {string} string - The string to be hashed.
 * @returns {Promise<string>} A Promise that resolves to the hashed string represented as a hexadecimal string.
 */
async function hashWithSHA256(string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(string);
    const hash = await crypto.subtle.digest('SHA-256', data);
    // convert hash to hex string
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

script.src = "./js/environment.js";
document.head.appendChild(script);