let currentDraggedElement;
let currentTask;
let assignLength;
let yOffSet;

/**
 * Event listener for the "load" event.
 * Loads the required data and renders the tasks.
 */
window.addEventListener("load", async function () {
  await loadRequiredData();
  renderTasks();
});

/**
 * Renders the tasks in different categories: ToDo, Awaiting, In Progress, and Done.
 */
function renderTasks() {
  renderSingelTask('todoContainer');
  renderSingelTask('awaitingFeedbackContainer');
  renderSingelTask('inprogressContainer');
  renderSingelTask('doneContainer');  
}

/**
 * Retrieves the number of finished subtasks.
 * @param {Array} e - The array of subtasks.
 * @returns {number} - The count of finished subtasks.
 */
function getSubtaskFineshed(e) {
  let count = 0;
  e.forEach((element) => {
    if (element.completed) {
      count++;
    }
  });
  return count;
}

/**
 * Sets the current dragged element.
 * @param {string} id - The ID of the element being dragged.
 */
function drag(id) {
  currentDraggedElement = id;
}

/**
 * Allows dropping of an element.
 * @param {Event} ev - The drop event object.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Handles the drop event by moving the dragged element to the specified category.
 * @param {string} cat - The category to move the element to.
 */
async function drop(cat) {
  tasks[getPos(currentDraggedElement)]["split"] = cat;
  renderTasks();
  await setItem("tasks", JSON.stringify(tasks));
  delHighlight(cat);
}

/**
 * Highlights the specified container to indicate a draggable area.
 * @param {string} container - The ID of the container to highlight.
 */
function highlight(container) {
  document.getElementById(container).classList.add("drag-area");
}

/**
 * Removes the highlight from the specified container.
 * @param {string} container - The ID of the container to remove the highlight from.
 */
function delHighlight(container) {
  document.getElementById(container).classList.remove("drag-area");
}

/**
 * Opens a task for detailed view.
 *
 * @param {Event} event - The event object.
 * @param {number} taskId - The ID of the task to open.
 * @returns {Promise<void>} A promise that resolves when the task is opened.
 */
async function openTask(event, taskId) {
  yOffSet = event.clientY;
  window.scroll(0, 0);
  await setItem("tasks", JSON.stringify(tasks));
  currentTask = getPos(taskId);
  document.getElementById("overlayContent").classList.remove("d-none");
  let categoryTask = categorys.find(
    (e) => e["name"] == tasks[currentTask]["category"]
  );
  let categoryTaskColor = categoryTask["color"];
  taskDetailView(tasks[currentTask], categoryTaskColor);
}

/**
 * Closes the overlay and re-renders the tasks.
 */
function closeOverlay() {
  document.getElementById("overlayContent").classList.add("d-none");
  renderTasks();
}

/**
 * Formats a date string in the format "YYYY-MM-DD" to "DD-MM-YYYY" format.
 *
 * @param {string} dateStrg - The date string to be formatted (in "YYYY-MM-DD" format).
 * @returns {string} The formatted date string in "DD-MM-YYYY" format.
 */
function formateDate(dateStrg) {
  const dateString = dateStrg;
  const date = new Date(dateString);
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

/**
 * Sets the priority button based on the provided priority.
 * @param {string} getPrio - The priority value.
 * @returns {string} - The HTML code for the priority button.
 */
function setPrioBtn(getPrio) {
  let namePrio = getPrio.charAt(0).toUpperCase() + getPrio.slice(1);
  return `<span class="prio_button_${getPrio}">${namePrio}<img src="./assets/images/prio${namePrio}.png" alt=""></span>`;
}

/**
 * Changes the status of a subtask entry between completed and not completed.
 *
 * @param {number} index - The index of the subtask entry.
 */
function changeValueSubtask(index) {
  let currentSubtask = tasks[currentTask].subtasks[index];
  if (currentSubtask.completed) {
    currentSubtask.completed = false;
  } else {
    currentSubtask.completed = true;
  }
  loadEditSubTasks(tasks[currentTask].subtasks);
}

/**
 * Renders the initial frame for a task.
 * @param {Object} task - The task object containing task details.
 */
function renderInitialFrame(task1) {
  let task = task1;
  assignLength = task["assign"].length;
  renderAssignedUsers(task);
}

/**
 * Initiates the edit task process.
 */
function editTask() {
    renderEditTask()
    let subta = tasks[currentTask]["subtasks"];
    renderInitialFrameEdit(tasks[currentTask]);
    setSelectedPrio(tasks[currentTask]);
    loadEditSubTasks(subta);
}

/**
 * Loads the subtasks for the edit task view.
 * @param {Array} subtask - The array of subtasks.
 */
function loadEditSubTasks(subtask) {
  if (subtask.length > 0) {
    document.getElementById("subtasks").innerHTML = "";
    document.getElementById("subtasks").innerHTML = `<div class="bold title">Sub Tasks:</div>`;
    subtask.forEach((e, index) => {
      if (!e.completed) {
        document.getElementById("subtasks").innerHTML += `<p style="color: red"><input type="checkbox" onclick="changeValueSubtask(${index})">${e.taskname}</p>`;
      } else {
        document.getElementById("subtasks").innerHTML += `
        <p style="color: green; text-decoration: line-through"><input type="checkbox" checked onclick="changeValueSubtask(${index})">${e.taskname}</p>`;
      }
    });
  }
}

/**
 * Sets the priority of a task based on the provided priority value.
 *
 * @param {string} prio - The priority value ('urgent', 'medium', or 'low').
 */
function setSelectedPrio(task) {
  let prio = task.prio
  let elementId = "prio" + (prio.charAt(0).toUpperCase() + prio.slice(1));
  document.getElementById(elementId).classList.add(`prio_button_${prio}`);
}

/**
 * Opens the contacts in board for assigning contacts to a task.
 * @param {number} taskId - The ID of the task.
 */
function openContactsBoard(taskid) {
  if (!menuContactsOpen) {
    document.getElementById("contacts").innerHTML = "";
    openMenu("contacts", "dropDownContacts");
    menuContactsOpen = true;
    renderContactsBoard(taskid);
  } else {
    closeMenuBoard("contacts", "dropDownContacts");
    menuContactsOpen = false;
  }
}

/**
 * Opens the specified menu and adds styling to indicate it is open.
 * @param {string} menuId - The ID of the menu element.
 * @param {string} dropDownId - The ID of the drop-down element.
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
 * Changes the assignment status of a user for a task.
 * @param {number} userId - The ID of the user.
 * @param {number} taskId - The ID of the task.
 */
function changeValueBoard(userId, taskId) {
  let taskAssignUsers = tasks[taskId].assign;
  let index = tasks[taskId].assign.indexOf(userId);
  if (taskAssignUsers.includes(userId)) {
    if (index !== -1) {
      tasks[taskId].assign.splice(index, 1);
    }
  } else {
    tasks[taskId].assign.push(userId);
  }
  renderInitialFrameEdit(tasks[taskId]);
}

/**
 * Sets the user assignment status on the assignment board.
 * @param {string} id - The ID of the checkbox element.
 * @param {number} taskId - The ID of the task.
 */
function setUserToAssignBoard(id, taskId) {
  let checkbox = document.getElementById(id);
  let userId = id;
  let taskNum = taskId;
  if (checkbox.checked) {
    checkbox.checked = false;
  } else {
    checkbox.checked = true;
  }
  changeValueBoard(userId, taskNum);
}

/**
 * Closes the menu board.
 * @param {string} id1 - The ID of the menu board element.
 * @param {string} id2 - The ID of the drop-down element.
 */
function closeMenuBoard(id1, id2) {
  document.getElementById(id1).innerHTML = "";
  document.getElementById(id2).classList.remove("drop_down_open");
  document.getElementById(id1).style.borderBottom = `0`;
  menuOpen = false;
  menuContactsOpen = false;
}

/**
 * Sets the priority of a task based on the provided priority value.
 *
 * @param {string} prio - The priority value ('urgent', 'medium', or 'low').
 */
function setPrioBoard(prio) {
  if (prio == prio) removeClassPrio();
  prioTask = prio;
  let elementId = "prio" + (prio.charAt(0).toUpperCase() + prio.slice(1));
  document.getElementById(elementId).classList.add(`prio_button_${prio}`);
}

/**
 * Deletes a task.
 * @param {number} taskId - The ID of the task to be deleted.
 */
async function deleteTask(taskId) {
  tasks.splice(taskId, 1);
  await setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  closeOverlay();
}

/**
 * Get the position of a task in the tasks array based on its ID.
 * @param {number} taskId - The ID of the task.
 * @returns {number} - The index of the task in the tasks array.
 */
function getPos(taskId) {
  const isLargeNumber = (element) => element.id == taskId;
  return tasks.findIndex(isLargeNumber);
}

/**
 * Get the color associated with a category.
 * @param {string} name - The name of the category.
 * @returns {string} - The color associated with the category.
 */
function getCategoryColor(name) {
  const isLargeNumber = (element) => element.name == name;
  let posName = categorys.findIndex(isLargeNumber);
  return categorys[posName].color;
}

/**
 * Perform a search based on the provided search value.
 */
function search() {
  let searchValue = document.getElementById("searchInput").value;
  searchValue = searchValue.toLowerCase();
  let results = [];
  tasks.forEach((task) => {
    var title = task.title.toLowerCase();
    var description = task.description.toLowerCase();
    if (!title.toLowerCase().includes(searchValue) && !description.toLowerCase().includes(searchValue)) {
      results.push(task);
    }
  });
  hideFalseSearchResults(results);
}

/**
 * Hide the search results that do not match the search criteria.
 * @param {Array} results - The array of tasks that do not match the search criteria.
 */
function hideFalseSearchResults(results) {
  tasks.forEach((e) => {
    let index = e.id;
    document.getElementById(`task-${index}`).classList.remove("d-none");
  });
  if (results.length > 0) {
    results.forEach((e) => {
      let index = e.id;
      document.getElementById(`task-${index}`).classList.add("d-none");
    });
  }
}

/**
 * Switch the task to a different container.
 * @param {string} container - The ID of the container to switch to.
 * @param {string} id - The ID of the task.
 */
function switchTask(container, id) {
  let section = container;
  drag(id);
  drop(`${section}`);
  document.getElementById(tasks[id].split).scrollIntoView();
}

/**
 * Closes the switch container with the specified taskId.
 * @param {string} taskId - The ID of the switch container to close.
 */
function closeSwitch(taskId) {
  document.getElementById(taskId).style.display = "none";
}