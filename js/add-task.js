let menuContactsOpen = false;
let menuOpen = false;
let button_delay = false;
let prioTask;
let color = "";
let taskCategory = "";
let subTasks = [];
let booleans = [];
let assignToTask = [];
let thisSubTask = [];

function setDateToDueDate() {
  let date = new Date().toISOString().split("T")[0];
  document.getElementById("dueDate").setAttribute("min", date);
}

/**
 * Opens or closes the contacts menu based on its current state.
 */
function openContacts(event) {
  event.stopPropagation();
  if (!menuContactsOpen) {
    document.getElementById("contacts").innerHTML = "";
    openMenu("contacts", "dropDownContacts");
    menuContactsOpen = true;
    renderContacts();
  } else {
    closeMenu("contacts", "dropDownContacts");
    menuContactsOpen = false;
  }
}

/**
 * Opens a menu identified by the given IDs and adds styling to indicate it is open.
 *
 * @param {string} id1 - The ID of the menu element.
 * @param {string} id2 - The ID of the drop-down element associated with the menu.
 */
function openMenu(id1, id2) {
  removeBorder(id2);
  document.getElementById(id1).style.borderBottom = `1px solid #D1D1D1`;
  document.getElementById(id2).classList.add("drop_down_open");
}

function removeBorder(id) {
  document.getElementById(id).style.borderColor = `#D1D1D1`;
}

/**
 * Changes the value of `assignToTask` array based on the provided `userId`.
 *
 * @param {number} userId - The ID of the user to be added or removed from the `assignToTask` array.
 */
function changeValue(userId) {
  let index = assignToTask.indexOf(userId);
  if (assignToTask.includes(userId)) {
    assignToTask.splice(index, 1);
  } else {
    assignToTask.push(userId);
  }
  renderInitial();
}

/**
 * Closes the menu identified by the provided IDs and removes associated styling.
 *
 * @param {string} id1 - The ID of the menu element.
 * @param {string} id2 - The ID of the drop-down element associated with the menu.
 */
function closeMenu(id1, id2) {
  document.getElementById(id1).innerHTML = "";
  document.getElementById(id2).classList.remove("drop_down_open");
  document.getElementById(id1).style.borderBottom = `0`;
  menuOpen = false;
  menuContactsOpen = false;
}

/**
 * Displays initials based on the data in the `initials` object.
 */
function showInitials() {
  document.getElementById("initials").innerHTML = "";
  for (let i = 0; i < initials["initials"].length; i++) {
    let initial = initials["initials"][i];
    let bgrColor = initials["color"][i];
    document.getElementById("initials").innerHTML += `<div class="initials" style="background-color: ${bgrColor};">${initial}</div>`;
  }
}

/**
 * Opens or closes the category menu based on its current state.
 * @param {Event} event - The event object triggered by the category menu.
 */
function openCategory(event) {
  event.stopPropagation();
  if (menuContactsOpen) {
    closeMenu("contacts", "dropDownContacts");
  }
  if (!menuOpen) {
    menuOpen = true;
    renderCategorys();
    openMenu("categorys", "dropDown");
  } else {
    closeMenu("categorys", "dropDown");
  }
}

/**
 * Opens the category menu if it is closed, or closes it if it is open.
 */
function renderCategorys() {
  document.getElementById("categorys").innerHTML = "";
  document.getElementById(
    "categorys"
  ).innerHTML = `<div class="render_categorys" onclick="inputCategory()">New category</div>`;
  for (let i = 0; i < categorys.length; i++) {
    let clr = categorys[i].color;
    let category = categorys[i].name;
    renderCategorysHTML(clr, i, category);
  }
}

/**
 * Renders the HTML for a category element based on the provided color, index, and category.
 *
 * @param {string} clr - The color of the category element.
 * @param {number} i - The index of the category element.
 * @param {string} category - The category name.
 * @returns {string} - The generated HTML for the category element.
 */
function renderCategorysHTML(clr, i, category) {
  return (document.getElementById("categorys").innerHTML += `<div class="render_categorys" id="ctgry${i}" onclick="setCategory('${category}', '${clr}')"><div class="set_category" >${category}<div  class="color2" style="background-color: ${clr};"></div></div><img class="delete_image" src="./assets/images/x.svg" onclick="deleteCategory(${i})"></div>`);
}

/**
 * Sets the priority of a task based on the provided priority value.
 *
 * @param {string} prio - The priority value ('urgent', 'medium', or 'low').
 */
function setPrio(prio) {
  if (prio == prio) removeClassPrio();
  prioTask = prio;
  let elementId = "prio" + (prio.charAt(0).toUpperCase() + prio.slice(1));
  document.getElementById(elementId).classList.add(`prio_button_${prio}`);
}

/**
 * Removes the priority classes from the priority buttons and resets the priority value.
 */
function removeClassPrio() {
  prioUrgent.classList.remove("prio_button_urgent");
  prioMedium.classList.remove("prio_button_medium");
  prioLow.classList.remove("prio_button_low");
  prio = "";
}

/**
 * Adds a subtask to the list of subtasks.
 */
function addSubtask() {
  subtaskValue = document.getElementById("subTask").value;
  if (subtaskValue.length < 1) {
    if (!button_delay) {
      button_delay = true;
      showNotice("pleaseEnterName");
      setTimeout(() => (button_delay = false), 2500);
    }
  } else {
    document.getElementById("subTask").value = "";
    document.getElementById("subtaskBox").innerHTML = "";
    let newSubTask = { taskname: subtaskValue, completed: false };
    thisSubTask.push(newSubTask);
    for (let i = 0; i < thisSubTask.length; i++) {
      let subTask = thisSubTask[i].taskname;
      renderSubtasHTML(subTask, i);
    }
  }
}

/**
 * Shows a notice with the specified ID by modifying its display and z-index properties.
 * @param {string} id - The ID of the notice element to show.
 */
function showNotice(id) {
  document.getElementById(id).style.display = "";
  document.getElementById(id).style.zIndex = "20";
  setTimeout(() => {
    document.getElementById(id).style.display = "";
    document.getElementById(id).style.display = "none";
  }, 1900);
  document.getElementById(id).classList.remove("addBord_box_inactive");
  document.getElementById(id).classList.add("addBord_box_active");
  setTimeout(
    () => document.getElementById(id).classList.add("addBord_box_inactive"),
    1500
  );
}

/**
 * Renders the HTML for a subtask.
 *
 * @param {string} subTask - The name of the subtask.
 * @param {number} i - The index of the subtask.
 * @returns {string} - The rendered HTML for the subtask.
 */
function renderSubtasHTML(subTask, i) {
  return (document.getElementById("subtaskBox").innerHTML += `
        <div class="subtask_child" id="subTask${i}">
            <input type="checkbox" id="CheckboxTask${i}" class="checkbox_subtask" onclick="setSubtaskStatus(${i})")>
            <div class ="subTask_Text">${subTask}</div>
            <img src="assets/images/x.svg" onclick="deleteSubtask(${i})">
        </div>`);
}

/**
 * Sets the status of a subtask.
 *
 * @param {number} i - The index of the subtask.
 */
function setSubtaskStatus(i) {
  if (document.getElementById("CheckboxTask" + i).checked == true)
    thisSubTask[i].completed = true;
  else thisSubTask[i].completed[i] = false;
}

/**
 * Deletes a subtask.
 *
 * @param {number} i - The index of the subtask.
 */
function deleteSubtask(i) {
  document.getElementById("subTask" + i).classList.add("slide-out-right");
  thisSubTask.splice(i, 1);
  setTimeout(() => {
    document.getElementById("subtaskBox").innerHTML = "";
    for (let i = 0; i < thisSubTask.length; i++) {
      let subTask = thisSubTask[i].taskname;
      renderSubtasHTML(subTask, i);
    }
  }, 500);
}

/**
 * Sets the color and task category variables to undefined,
 * sets the menuOpen variable to false,
 * and shows the input category HTML.
 */
function inputCategory() {
  color = undefined;
  taskCategory = undefined;
  menuOpen = false;
  showInputCategoryHTML();
}

/**
 * Adds a new category based on the provided category value and color.
 * If the category value is empty or the color is not selected,
 * it shows a notice and delays the button response.
 * Otherwise, it creates a new category object,
 * adds it to the categorys array,
 * saves the updated categorys array to storage,
 * sets the taskCategory variable to the new category value,
 * shows the category color HTML, and sets the menuOpen variable to false.
 */
async function addNewCategory() {
  let categoryValue = document.getElementById("categoryValue").value;
  if (categoryValue.length < 1 || !color) {
    if (!button_delay) {
      button_delay = true;
      showNotice("pleaseCategoryName");
      setTimeout(() => (button_delay = false), 2500);
    }
  } else {
    let newCat = { name: categoryValue, color: color };
    categorys.push(newCat);
    await setItem("categorys", JSON.stringify(categorys));
    taskCategory = categoryValue;
    showCategoryColorHTML();
    menuOpen = false;
  }
}

/**
 * Sets the selected color for the category.
 * If a color is already selected, it removes the "color_active" class from the previous color element.
 * It adds the "color_active" class to the newly selected color element.
 * Updates the color variable with the selected color value.
 * @param {string} clr - The color value to be set.
 */
function setColor(clr) {
  if (color) {
    document.getElementById(color).classList.remove("color_active");
  }
  document.getElementById(clr).classList.add("color_active");
  color = clr;
}

/**
 * Sets the category and color for a task.
 *
 * @param {string} ctgry - The category name.
 * @param {string} clr - The color associated with the category.
 */
function setCategory(ctgry, clr) {
  color = clr;
  taskCategory = ctgry;
  showCategoryColorHTML();
  menuOpen = false;
}

/**
 * Displays the HTML representation of the category color.
 */
function showCategoryColorHTML() {
  return (document.getElementById("categoryBox").innerHTML = `<div class="drop_down" id="dropDown" onclick="openCategory(event)"><div class="category_color">${taskCategory}<div  class="color2" style="background-color: ${color};"></div></div><img class="down_image" src="assets/images/drop-down-arrow.png"></div><div id="categorys" class="render_categorys_box"></div>`);
}

/**
 * Removes the priority classes and clears the priority value.
 */
function removePrio() {
  document.getElementById("prioUrgent").classList.remove("prio_button_urgent");
  document.getElementById("prioMedium").classList.remove("prio_button_medium");
  document.getElementById("prioLow").classList.remove("prio_button_low");
  prio = undefined;
}

/**
 * Creates a new task.
 *
 * @returns {Promise<void>} A promise that resolves when the task is created.
 */
async function createTask(boardPos) {
  let setSplit = getBoardPosition(boardPos);
  findeFieldIsNotSet();
  if (isFormValid()) {
    showNotice("addBordBox");
    closeMenu("contacts", "dropDownContacts");
    let newTask = setNewTask(setSplit, taskTitle, description, taskCategory, dueDate);
    tasks.push(newTask);
    await setItem("tasks", JSON.stringify(tasks));
    navigateToBoard();
  } else {
    showNotice("missing");
  }
}

/**
 * Creates a new task object with the provided information.
 *
 * @param {string} setSplit - The split value for the task.
 * @param {string} taskTitle - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} taskCategory - The category of the task.
 * @param {string} dueDate - The due date of the task.
 * @returns {object} The new task object.
 */
function setNewTask(setSplit, taskTitle, description, taskCategory, dueDate) {
  let highestId = getNewUserId();
  return {
    id: highestId,
    split: setSplit,
    title: taskTitle.value,
    description: description.value,
    category: taskCategory,
    date: dueDate.value,
    prio: prioTask,
    subtasks: thisSubTask,
    assign: assignToTask,
  };
}

/**
 * Navigates to the board page after a delay.
 */
function navigateToBoard() {
  setTimeout(() => {
    showNotice("addBordBox");
    window.location.href = "board.html";
  }, 700);
}

/**
 * Retrieves the ID of the board position.
 * @param {object} boardPos - The board position object.
 * @returns {string} The ID of the board position, or "todoContainer" if undefined.
 */
function getBoardPosition(boardPos) {
  if (typeof boardPos !== "undefined") {
    return boardPos.id;
  } else {
    return "todoContainer";
  }
}

/**
 * Retrieves a new unique user ID.
 * @returns {number} The new user ID.
 */
function getNewUserId() {
  let highestId = -Infinity;
  if (tasks.length == 0) {
    return 0;
  } else {
    for (let i = 0; i < tasks.length; i++) {
      const obj = tasks[i];
      if (obj.id > highestId) {
        highestId = obj.id;
      }
    }
    return highestId + 1;
  }
}

/**
 * Checks if the form inputs are valid.
 * @returns {boolean} True if the form inputs are valid, false otherwise.
 */
function isFormValid() {
  if (
    taskTitle.value.length > 2 &&
    description.value.length > 2 &&
    taskCategory &&
    prioTask
  ) {
    return true;
  } else return false;
}

/**
 * Finds fields that are not set and highlights them by changing their border color to red.
 */
function findeFieldIsNotSet() {
  if (taskTitle.value.length < 2)
    document.getElementById("taskTitle").style.borderColor = `red`;
  if (description.value.length < 2)
    document.getElementById("description").style.borderColor = `red`;
  if (!taskCategory)
    document.getElementById("dropDown").style.borderColor = `red`;
  if (!prioTask) document.getElementById("prio").style.borderColor = `red`;
}

/**
 * Sets or unsets a user for assignment based on the checkbox state.
 * 
 * @param {Event} event - The event object.
 * @param {string} id - The ID of the checkbox element.
 */
function setUserToAssign(event, id) {
  event.stopPropagation();
  let checkbox = document.getElementById(id);
  let userId = id;
  if (checkbox.checked) {
    checkbox.checked = false;
  } else {
    checkbox.checked = true;
  }
  changeValue(userId);
}

/**
 * Renders the initial user avatars for the initial assignment.
 */
function renderInitial() {
  let arr = document.getElementById("assignUserBox");
  arr.innerHTML = "";
  assignToTask.forEach((e) => {
    let userData = users.find(({ id }) => id == e);
    arr.innerHTML += `
        <div class="selected-user" style="background-color:${userData.color}">
            ${userData.initials}
        </div>`;
  });
}

function clearAll() {
  location.reload();
}

/**
 * Closes any open menus.
 */
function closeMenus() {
  if (menuContactsOpen || menuOpen) {
    closeMenu("categorys", "dropDown");
    closeMenu("contacts", "dropDownContacts");
  }
}

/**
 * Renders the contacts in the contacts box.
 */
function renderContacts() {
  let contactsBox = document.getElementById("contacts");
  contactsBox.innerHTML = ``;
  contactsBox.innerHTML += `<div class="render_categorys">Invite new contact</div>`;
  contactsBox.innerHTML += `<div id="selectetContacts"></div>`;
  renderSelectedContacts();
}

/**
 * Renders the selected contacts.
 */
function renderSelectedContacts(){
  users.forEach((element) => {
    if (element.name == currentUser) {
      let currentUserId = users.findIndex((x) => x.name === currentUser);
      if (assignToTask.includes(currentUserId)) {
        renderSelectedContac(element, "YOU", "checked");
      } else {
        renderSelectedContac(element, "YOU");
      }
    } else if (element.name !== currentUser && !assignToTask.includes(element.id)) {
      renderSelectedContac(element, element.name);
    } else if (element.name !== currentUser) {
      renderSelectedContac(element, element.name, "checked");
    }
  });
}

/**
 * Renders the selected contact.
 * @param {Object} element - The contact element.
 * @param {string} name - The name of the contact.
 * @param {string} [isChecked] - Specifies if the contact is checked.
 */
function renderSelectedContac(element, name, isChecked) {
  document.getElementById("selectetContacts").innerHTML += ` 
  <div class="selectet-contact-box" onclick="setUserToAssign(event, ${element.id})">
  <label for="${element.id}"> ${name}</label>
  <input type="checkbox" id="${element.id}" name="${element.id}" value="${element.id}" onchange="changeValue(${element.id})" ${isChecked} onclick="setUserToAssign(event, ${element.id})">
  </div>
  `;
}

/**
 * Shows the HTML input field for entering a new category.
 * @returns {string} The HTML content to be displayed.
 */
function showInputCategoryHTML() {
  return (document.getElementById("categoryBox").innerHTML = `
    <div class="category_name_box">  
                    <input class="input" type="text" placeholder="New category name" id="categoryValue" required maxlength="29">
                    <div class="x✔">
                        <div onclick="clearInputField()" class="x"><img src="assets/images/x.svg" alt=""></div>
                        <div onclick="addNewCategory()"><img class="hook" src="assets/images/haken.png"></div>
                    </div>
                </div>
                <div class="color_points">
                    <div id="#8AA4FF" class="color" onclick="setColor('#8AA4FF')" style="background-color: #8AA4FF;"></div>
                    <div id="#FF0000" class="color" onclick="setColor('#FF0000')" style="background-color: #FF0000;"></div>
                    <div id="#2AD300" class="color" onclick="setColor('#2AD300')" style="background-color: #2AD300;"></div>
                    <div id="#FF8A00" class="color" onclick="setColor('#FF8A00')" style="background-color: #FF8A00;"></div>
                    <div id="#E200BE" class="color" onclick="setColor('#E200BE')" style="background-color: #E200BE;"></div>
                    <div id="#0038FF" class="color" onclick="setColor('#0038FF')" style="background-color: #0038FF;"></div>
                </div>`);
}

/**
 * Clears the input field in the category box.
 * @returns {string} The HTML content to be displayed.
 */
function clearInputField() {
  return (document.getElementById("categoryBox").innerHTML = `
    <div class="drop_down" id="dropDown" onclick="openCategory(event)">
                                Select task category
                                <img class="down_image" src="./assets/images/drop-down-arrow.png">
                            </div>
                            <div id="categorys" class="render_categorys_box"></div>
    
    `);
}
