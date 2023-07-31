/**
 * Loads the subtasks of a task and renders them in the task detail view.
 * @param {Array} subtasks - The array of subtasks.
 */
function loadSubTasks(subtask) {
    if (subtask.length > 0) {
      document.getElementById("subtasks").innerHTML = "";
      document.getElementById("subtasks").innerHTML = `<div class="bold title">Sub Tasks:</div>`;
      subtask.forEach((e) => {
        if (!e.completed) {
          document.getElementById("subtasks").innerHTML += `<p style="color: red">${e.taskname}</p>`;
        } else {
          document.getElementById("subtasks").innerHTML += `<p style="color: green; text-decoration:line-through">${e.taskname}</p>`;
        }
      });
    }
  }
  
  
/**
 * Renders the assigned users for a task.
 * @param {Object} task - The task object containing task details.
 */
function renderAssignedUsers(task) {
    let taskPrio = task.prio;  
    taskPrio = taskPrio.charAt(0).toUpperCase() + taskPrio.slice(1);
    renderAssignedUsersAndPriority(task, taskPrio);
  }

/**
 * Handle the task switching on mobile devices.
 * @param {Event} event - The event object.
 * @param {string} id - The ID of the task.
 */
function switchMobile(event, id) {
    let sectionArr = [
      "todoContainer",
      "inprogressContainer",
      "awaitingFeedbackContainer",
      "doneContainer",
    ];
    let taskId = id;
    event.stopPropagation();
    let iOfTask = tasks.indexOf(tasks.find(({ id }) => id == taskId));
    let nameOf = tasks[iOfTask].split;
    sectionArr.splice(sectionArr.indexOf(nameOf), 1);
    renderMobileSwitch(sectionArr, id, taskId);
  }  

/**
 * Renders the tasks in the category.
 */
function renderSingelTask(container) {
    let arr = tasks.filter((e) => e["split"] == container);
    document.getElementById(container).innerHTML = "";
    arr.forEach((element) => {
      document.getElementById(container).innerHTML +=
        renderTaskContainer(element);
      renderInitialFrame(element);
      renderProgressBar(element);
    });
}

/**
 * Renders the progress bar for a task's subtasks.
 * @param {Object} element - The task element.
 */
function renderProgressBar(element) {
    if (element.subtasks.length > 0) {
      let max = element.subtasks.length;
      let value = getSubtaskFineshed(element.subtasks);
      document.getElementById(`subtaskProgress${element.id}`).innerHTML = "";
      document.getElementById(`subtaskProgress${element.id}`).innerHTML = `
          <p><progress id="file" value="${value}" max="${max}"> 32% </progress> ${value}/${max} Done</p>
          `;
    }
}

/**
 * Renders the detailed view of a task.
 * @param {Object} task - The task object.
 * @param {string} categoryColor - The color of the task category.
 */
function taskDetailView(task, categoryColor) {
    let overlay = document.getElementById("overlayContent");
    overlay.innerHTML = "";
    overlay.innerHTML = /*html */ `
              <div id="taskView" onclick="noClose(event)">
              <img src="./assets/images/x.svg" alt="" class="close" onclick="closeOverlay()">
              <p style="background-color: ${categoryColor};" class="category">${task["category"]}</p>
              <h3>${task["title"]}</h3>
              <p>${task["description"]}</p>
              <p><span class="bold">Due date:</span> ${formateDate(task["date"])}</p>
              <p><span class="bold">Priority:</span> ${setPrioBtn(task["prio"])}</p>
              <div id="subtasks"></div>
              <div class="assigned">
                  <p class="bold">Assigned To:</p>
                  <div id="assignUser"></div>
              </div>
              <div class="actions">
                  <img src="./assets/images/delete.png" alt="" class="delete-btn" onclick="deleteTask(${currentTask})">
                  <div class="edit-btn" onclick="editTask(${task.id})">
                      <img src="./assets/images/pen-white.png" alt="">
                  </div>
              </div>
          </div>    
      `;
    renderAssingUser(task.assign);
    loadSubTasks(task.subtasks);
  }

/**
 * Renders the assigned users in the task detail view.
 * @param {Array} assignUser - The array of assigned user IDs.
 */
function renderAssingUser(assignUser) {
    let arr = document.getElementById("assignUser");
    arr.innerHTML = "";
    assignUser.forEach((e) => {
      let userData = users.find(({ id }) => id == e);
      arr.innerHTML += `<div class="assign-user-content"> <span class="frame" style="background-color:${userData.color}">${userData.initials}</span> ${userData.name}`;
    });
  }

/**
 * Renders the HTML markup for a task container.
 * @param {Object} task - The task object containing task details.
 * @returns {string} The HTML markup for the task container.
 */
function renderTaskContainer(task) {
    return /*html */ `<div class="task-container" draggable="true" ondragstart="drag(${task.id})" onclick="openTask(event,${task.id})" id="task-${task.id}">
              <div class="head">
              <p class="task-department" style="background-color: ${getCategoryColor(
                task.category
              )}">${task.category}</p>
              <p class="switch-task-btn" onclick="switchMobile(event,'${
                task.id
              }')">change to</p>
              </div>
              <p class="task-titel">${task.title}</p>
              <p class="task-description-text">${task.description}</p>
              <div id="subtaskProgress${task.id}"></div>
              <div class="selected-user-icons" id="assignUserIcons${
                task.id
              }"></div>
          </div>`;
  }

/**
 * Renders assigned users and priority image based on task information.
 * @param {Object} task - The task object.
 * @param {Array} users - The array of users.
 * @param {number} count - The count of additional assigned users.
 * @param {string} taskPrio - The priority of the task.
 * @param {HTMLElement} elementId - The HTML element to render the assigned users and priority.
 */
function renderAssignedUsersAndPriority(task, taskPrio) {
    let elmentId = document.getElementById(`assignUserIcons${task.id}`);
    let count = 0;
    elmentId.innerHTML = "";
    if(task["assign"].length > 0) {
        for (let i = 0; i < task["assign"].length; i++) {
            if (i < 2) {
              const e = task["assign"][i];
              let userData = users.find(({ id }) => id == e);
              elmentId.innerHTML += `<div class="selected-user" style="background-color:${userData.color}">${userData.initials}</div>`;
            }else 
                count++
        }
        if(count > 0){
            elmentId.innerHTML += `<div class="selected-user" style="background-color:#2A3647">+${count}</div><img src="./assets/images/prio${taskPrio}.png" alt="">`;
        }else {
            elmentId.innerHTML += `<img src="./assets/images/prio${taskPrio}.png" alt="">`;
        }
      }else
        elmentId.innerHTML += `<img src="./assets/images/prio${taskPrio}.png" alt="">`;
}

/**
 * Renders the initial frame for the assigned users in the edit task view.
 * @param {Object} task - The task object.
 */
function renderInitialFrameEdit(task) {
    let arr = document.getElementById("assignUserBox");
    arr.innerHTML = "";
    task["assign"].forEach((e) => {
      let userData = users.find(({ id }) => id == e);
      arr.innerHTML += `
          <div class="selected-user" style="background-color:${userData.color}">
              ${userData.initials}
          </div>`;
    });
  }

/**
 * Renders the contacts in the contacts box.
 */
function renderContactsBoard() {
    let contactsBox = document.getElementById("contacts");
    contactsBox.innerHTML = ``;
    contactsBox.innerHTML += `<div class="render_categorys">Invite new contact</div>`;
    contactsBox.innerHTML += `<div id="selectetContacts"></div>`;
    renderSelectedContacts();
}

/**
 * Render the task switching options on mobile devices.
 * @param {Array} sectionArr - The array of section names to render as options.
 * @param {string} id - The ID of the task.
 * @param {string} taskId - The ID of the task.
 */
function renderMobileSwitch(sectionArr, id, taskId) {
    document.getElementById("task-" + id).innerHTML += /*html */ `    
    <div class="switch-container" onclick="noClose(event)" id="switchTask-${id}">
            <img src="./assets/images/close.png" alt="" onclick="closeSwitch('switchTask-${id}')">
    </div>`;
    sectionArr.forEach((e) => {
    document.getElementById(`switchTask-${id}`).innerHTML += /*html */ `<p onclick="switchTask('${e}', ${taskId})">${e.slice(0,-9)}</p>`;
    });
}

/**
 * Renders the edit task view by updating the HTML content of the overlay element.
 * It replaces the content of the 'overlayContent' element with the HTML markup for the edit task view.
 * The edit task view includes input fields and elements to modify the task details such as title, description, due date, priority, assigned contacts, and subtasks.
 * The values of the input fields and elements are pre-filled with the current task's details.
 * The function also attaches event handlers to relevant elements.
 */
function renderEditTask() {
    document.getElementById("overlayContent").innerHTML = "";
    document.getElementById("overlayContent").innerHTML = `
      <div id="taskEditView" onclick="noClose(event)">
      <img src="./assets/images/x.svg" alt="" class="close" onclick="closeOverlay()">
      <p class="title">Title</p>
      <input type="text" placeholder="Enter a title" class="input" id="taskTitle" value="${tasks[currentTask].title}">
      <p class="title">Description</p>
      <textarea class="input" name="description" id="description" placeholder="Enter a Description">${tasks[currentTask].description}</textarea>
      <p class="title">Due Date</p>
      <input type="date" placeholder="dd/mm/yy" class="input" id="dueDate" value="${tasks[currentTask].date}">
      <p class="title">Prio</p>
      <div class="prio-btns" id="prio">
          <div class="prio-btn" id="prioUrgent" onclick="setPrioBoard('urgent')"> Urgent <img
                  src="./assets/images/prioUrgent.png" alt=""></div>
          <div class="prio-btn" id="prioMedium" onclick="setPrioBoard('medium')"> Medium <img
                  src="./assets/images/prioMedium.png" alt=""></div>
          <div class="prio-btn" id="prioLow" onclick="setPrioBoard('low')"> Low <img src="./assets/images/prioLow.png"
                  alt=""></div>
      </div>
      <div id="subtasks"></div>
      <p class="title">Assigned to</p>
      <div id="contactBox">
          <div class="drop_down" id="dropDownContacts" onclick="openContactsBoard(${currentTask})">
              Select contacts to assign
              <img class="down_image" src="./assets/images/drop-down-arrow.png">
          </div>
          <div id="contacts" class="render_categorys_box"></div>
      </div>
      <div id="assignUserBox" class="selected-user-icons"></div>
      <div class="save-btn" onclick="openTask(event,${tasks[currentTask].id})">
                  Ok <img src="./assets/images/contacts-icons/check-icon.png" alt="" >
              </div>
  </div>`;
}