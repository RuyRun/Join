let orderedContacts = new Array([], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []);

window.addEventListener('load', async function () {
    await loadRequiredData();
    loadContacts();
    if (this.window.innerWidth > 880) {
        showContact(0);
    }
});

window.addEventListener("resize", () => {
    if (this.window.innerWidth > 880) {
        document.getElementById('contacDetail').style.display = 'block';
        showContact(0);
    }else {
        document.getElementById('contacDetail').style.display = 'none';
    }
});

/**
 * Loads and renders the contacts in the contacts container.
 */
function loadContacts() {
    let container = document.getElementById('contactsCon');
    container.innerHTML = '';
    orderContacts();
    for (let i = 0; i < orderedContacts.length; i++) {
        if (orderedContacts[i].length > 0) {
            container.innerHTML += genContactsHeader(i);
            for (let j = 0; j < orderedContacts[i].length; j++) {
                container.innerHTML += genContactHtml(orderedContacts[i][j]);
            }
        }
    }
}

/**
 * Sort Contacts alphabetical to orderedContacts
 * 
 */
function orderContacts() {
    sortContacts();
    orderedContacts = new Array([], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []);
    for (let i = 0; i < contacts.length; i++) {
        contacts[i].id = i;
        let letter = contacts[i].name.toLowerCase().toString();
        letter = letter.replace(/\u00e4/g, "ae").replace(/\u00fc/g, "ue").replace(/\u00f6/g, "oe");
        letter = letter.slice(0, 1);
        letter = letter.charCodeAt(0) - 97;
        orderedContacts[letter].push(contacts[i]);
    }
}

/**
 * Sort Contacts by Firstname from A to Z
 */
function sortContacts() {
    contacts = contacts.sort(function (a, b) {
        return a.name.toLowerCase().localeCompare(
            b.name.toLowerCase()
        );
    });
}

/**
 * 
 * @param {Number} i formCharCode  
 * @returns HTML template Contactlist header
 */
function genContactsHeader(i) {
    return /*html */ `
            <div class="contact-letters">
                ${String.fromCharCode(i + 97).toUpperCase()}
            </div>`;
}

/**
 * Restores the visibility and position of the contacts container and contact detail panel.
 */
function showItBack() {
    let el = document.getElementById('contactsCon');
    let elright = document.getElementById('contacDetail');
    el.classList.remove('slide-out-left');
    elright.classList.remove('slide-in-right');
    el.classList.add('retrieve-slide-out-left');
    elright.classList.add('retrieve-slide-in-right');
    setTimeout(() => {
        let btnNew = document.getElementById('newContactBtn');
        btnNew.style.display = 'block'
        el.classList.remove('retrieve-slide-out-left');
        elright.classList.remove('retrieve-slide-in-right');
        elright.style.display = 'none';
    }, 500);
}

/**
 * Shows the contact details if the screen width is greater than 880px.
 */
function showDetailsIfIsMobile() {
    if (window.innerWidth > 880) {
        changeActiv();
        document.getElementById('contacDetail').style.display = 'block';
    } else if(window.innerWidth <= 880) {
        let elright = document.getElementById('contacDetail');
        let el = document.getElementById('contactsCon');
        let btnNew = document.getElementById('newContactBtn');
        elright.style.display = 'none';
        btnNew.style.display = 'none'
        el.classList.add('slide-out-left');
        elright.classList.add('slide-in-right');
        elright.style.display = 'block';
    }
}

/**
 * Changes the active state of the contact buttons.
 */
function changeActiv() {
    let btnContainer = document.getElementById('contactsCon');
    let btns = btnContainer.getElementsByClassName('list-contact');
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            let current = document.getElementsByClassName("list-contact-activ");
            current[0].className = current[0].className.replace("list-contact-activ", "");
            this.className += " list-contact-activ";
        });
    }
}

/**
 * shows the first Contact at the details
 */
async function showContact(id) {
    let btnContainer = document.getElementById('contactsCon');
    let btns = btnContainer.getElementsByClassName('list-contact');
    let contactId = id || btns[0].id;
    let contactElement = document.getElementById(contactId);
    Array.from(document.querySelectorAll('.list-contact.list-contact-activ')).forEach((el) => el.classList.remove('list-contact-activ'));
    contactElement.className += " list-contact-activ";
    showDetails(contactId);
}

/**
 * Displays the contact edit form in the overlay.
 * @param {Object} contact - The contact object to edit.
 */
function editShowContact(contact) {
    document.getElementById('overlayContent').innerHTML = '';
    if (typeof contact !== 'undefined') {
        showEditContact(contact);
    } else {
        showCreateContact();
    }
    toggleDNone('overlayContent');
}

/**
 * Validates that only numeric keys are allowed.
 * @param {Event} evt - The keypress event.
 * @returns {boolean} Returns true if the key is numeric, false otherwise.
 */
function onlyNumberKey(evt) {             
    // Only ASCII character in that range allowed
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}

/**
 * add/remove class d-none to your Object
 * @param {string} id - need the id from your Object
 */
function toggleDNone(id) {
    document.getElementById(`${id}`).classList.toggle('d-none');
}

/**
 * 
 * @param {Integer} id - id from user you want to edit
 */
function editContact(id) {
    let name = document.getElementById('name-input').value;
    let email = document.getElementById('email-input').value;
    let phone = document.getElementById('phone-input').value;
    let initials = getInitial(name);
    contacts[id].name = name;
    contacts[id].mail = email;
    contacts[id].phone = phone;
    contacts[id].initials = initials;
    pushToServer(id);
}

/**
 * Pushes the contacts data to the server.
 * @param {number} id - The ID of the contact to show after pushing to the server.
 */
async function pushToServer(id) {
    toggleDNone('overlayContent');
    await setItem('users', JSON.stringify(contacts));
    loadContacts();
    if (id !== undefined) {
        showContact(id);
    } else {
        location.reload();
    }
}

/**
 * Deletes a contact and removes the contact from associated tasks.
 * @param {number} userId - The ID of the contact to be deleted.
 * @returns {Promise<void>}
 */
async function delContact(userId) {
    deleteUserFromTasks(userId)
    contacts.splice(userId, 1);
    await pushToServer();
}

/**
 * Deletes a user from the assignee list of all tasks.
 * @param {number} userId - The ID of the user to be removed from tasks.
 * @returns {Promise<void>}
 */
async function deleteUserFromTasks(userId) {
    tasks.forEach(function (task) {
        let index = task.assign.indexOf(userId);
        if (index !== -1) {
            task.assign.splice(index, 1);
        }
    });
    await setItem('tasks', JSON.stringify(tasks));
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
 * Adds a new contact.
 */
function addContact() {
    let name = document.getElementById('name-input').value;
    let email = document.getElementById('email-input').value;
    let phone = document.getElementById('phone-input').value;
    // Verify that the user entered a name, email address, and phone number.
    if (!name || !email || !phone) {
        alert('Bitte geben Sie einen Namen, eine E-Mail-Adresse und eine Telefonnummer ein.');
        return;
    }
    pushNewContactToServer(name, email, phone);
}

/**
 * Pushes a new contact to the server.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function pushNewContactToServer(name, email, phone){
    let initials = getInitial(name);
    let color = getRandomColor();
    let singelContact = {
        name: name,
        mail: email,
        phone: phone,
        initials: initials,
        color: color,
    }
    contacts.push(singelContact);
    pushToServer();
}

/**
 * Retrunt a random Color-Hexcode 
 * @returns random color hexcode (#7D735F)
 */
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Shows the contact details in the mobile view.
 */
function showDetailsMobile() {
    let windowsWidth = window.innerWidth;
    if (windowsWidth <= 880) {
        document.getElementById('contactsCon').classList.add('slide-left-out-go');
        document.getElementById('contactsDetails').classList.add('show-content')
    }
}

/**
 * Closes the overlay and reloads the contacts.
 */
function closeOverlay() {
    document.getElementById('overlayContent').classList.add('d-none');
    loadContacts();
}