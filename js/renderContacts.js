/**
 * Displays the details of a contact.
 * @param {string} id - The ID of the contact.
 */
function showDetails(id) {
    showDetailsIfIsMobile();
    document.getElementById('contacDetails').innerHTML = '';
    document.getElementById('contacDetails').innerHTML = /*html */`
        <div class="name-section">
                    <span class="contact-frame" style="background-color: ${contacts[id].color}">${contacts[id].initials}</span>
                    <div class="name" onclick="showAddTaskOverlay()">
                        <h3>${contacts[id].name}</h3>
                        <p><img src="./assets/images/plus-blue.png" alt=""> Add Task</p>
                    </div>
                </div>
                <div class="contact-info-head">
                    <h4>Contact Information</h4>
                    <p class="edit-contact" onclick="editShowContact(${id})">
                        <img src="./assets/images/pen.png" alt="">
                        Edit Contact
                    </p>
                </div>
                <div class="contact-info-content">
                    <div class="content-box">
                        <p class="name">Email</p>
                        <p class="mail">${contacts[id].mail}</p>
                    </div>
                    <div class="content-box">
                        <p class="name">Phone</p>
                        <p>${contacts[id].phone}</p>
                    </div>
                </div>
                <div class="icons">
                <img src="./assets/images/pen-white.png" class="edit-btn" onclick="editShowContact(${id})">`;
}

/**
 * Displays the contact edit form in the overlay.
 * @param {number} id - The ID of the contact to edit.
 */
function showEditContact(id) {
    let userId = id;
    document.getElementById('overlayContent').innerHTML =  /*html */`<div class="overlay-left">
        <img src="./assets/images/contacts-icons/close-white.png" class="close-top" onclick="toggleDNone('overlayContent')">
    <img src="./assets/images/menu-logo.png" alt="" id="logo">
    <p class="overlay-title">Edit contact</p>
    <div class="overlay-sep"></div>
</div>
<div class="overlay-right" onclick="noClose(event)">
<span class="contact-frame" style="background-color: ${contacts[id].color}">${contacts[id].initials}</span> 
    <form onsubmit="editContact(${userId}); return false">
        <input class="name-input" id="name-input" placeholder="Name" type="text" pattern="[a-zA-ZÄäÜüÖöß ]*" maxlength="30" required value="${contacts[id].name}">
        <input class="email-input" id="email-input" placeholder="Email" type="email" required value="${contacts[id].mail}">
        <input class="phone-input" id="phone-input" placeholder="Phone" type="tel" minlength="6" maxlength="30" required value="${contacts[id].phone}" onkeypress="return onlyNumberKey(event)">
        <div class="buttons">
            <button type="button" class="cancel-contact-btn" onclick="delContact(${userId})">Delete</button>
            <button type="submit" class="add-contact-btn" >
                Save
            </button>
        </div>        
    </form>
    <div class="close">
        <img src="./assets/images/contacts-icons/close.png" alt="" onclick="toggleDNone('overlayContent')" class="dark">
    </div>
</div>`
}

/**
 * Displays the contact creation form in the overlay.
 */
function showCreateContact() {
    document.getElementById('overlayContent').innerHTML =  /*html */`
    <div class="close-top">
        <img src="./assets/images/contacts-icons/close-white.png" alt="" onclick="toggleDNone('overlayContent')" class="white">
    </div><div class="overlay-left overlay-left-add-contact">        
    <img src="./assets/images/menu-logo.png" alt="" id="logo">
    <p class="overlay-title">Add contact</p>
    <p class="teste">Task are better with a team!</p>
    <div class="overlay-sep"></div>
</div>
<!-- createContact -->
<div class="overlay-right overlay-right-add-contact" onclick="noClose(event)">
    <img src="./assets/images/contacts-icons/userIcon.png" alt="" class="user-icon">
    <form action="#" onsubmit="addContact(); return false">
        <input class="name-input" id="name-input" placeholder="Name" type="text" pattern="[a-zA-ZÄäÜüÖöß ]*" maxlength="30" required>
        <input class="email-input" id="email-input" placeholder="Email" type="email" required>
        <input class="phone-input" id="phone-input" placeholder="Phone" type="tel" minlength="6" maxlength="30" required  onkeypress="return onlyNumberKey(event)">
        <div class="buttons">
            <button type="button" class="cancel-contact-btn" onclick="toggleDNone('overlayContent')">Cancel </button>
            <button type="submit" class="add-contact-btn" >
                Create contact
            </button>
        </div>
    </form>
    <div class="close">
        <img src="./assets/images/contacts-icons/close.png" alt="" onclick="toggleDNone('overlayContent')" class="dark">
    </div>
</div>`
}

/**
 * Generates the HTML for a contact element.
 * @param {Object} contact - The contact object.
 * @returns {string} The generated HTML.
 */
function genContactHtml(contact) {
    return /*html */` 
        <div class="list-contact" id="${contact.id}" onclick='showDetails(${contact.id})'>
                <div class="frame-content">
                    <span class="contact-frame" style="background-color: ${contact.color}">${contact.initials}</span>
                </div>
                <div class="list-contact-info">
                    <p>${contact.name}</p>
                    <p>${contact.mail}</p>
                </div>
            </div>`;
}