
function showAddTaskOverlay(boardPos) {
    let element = document.getElementById('overlayContent');
    window.scroll(0,0);
    document.body.classList.add('overflow')
    element.innerHTML = '';
    element.classList.remove('d-none');
    element.innerHTML = /*html */`
        <div id="overlayAddTask" onclick="noClose(event)">
        <div class="add-task" id="overlayAddTask">
            <div class="head">
                <h2>Add Task</h2>
            </div>
            <div class="container">
                <form action="#" onclick="closeMenus()">
                    <div class="left">
                        <div class="input-box">
                            <p class="title">Title</p>
                            <input type="text" placeholder="Enter a title" class="input" id="taskTitle">
                        </div>
                        <div class="input-box">
                            <p class="title">Description</p>
                            <textarea class="input" name="description" id="description" placeholder="Enter a Description"></textarea>
                        </div>
                        <div class="input-box">
                            <p class="title">Category</p>
                            <div id="categoryBox">
                                <div class="drop_down" id="dropDown" onclick="openCategory(event)">
                                    Select task category
                                    <img class="down_image" src="./assets/images/drop-down-arrow.png">
                                </div>
                                <div id="categorys" class="render_categorys_box"></div>
                            </div>
                        </div>
                        <div class="input-box">
                            <p class="title">Assigned to</p>
                            <div id="contactBox">
                                <div class="drop_down" id="dropDownContacts" onclick="openContacts(event)">
                                    Select contacts to assign
                                    <img class="down_image" src="./assets/images/drop-down-arrow.png">
                                </div>
                                <div id="contacts" class="render_categorys_box"></div>
                            </div>
                            <div id="initials" class="initials_box"></div>
                        </div>
                        <div id="assignUserBox" class="selected-user-icons"></div>
                    </div>
                    <div class="center"></div>
                    <div class="right">
                        <div class="input-box">
                            <p class="title">Due Date</p>
                            <input type="date" placeholder="dd/mm/yy" class="input" id="dueDate">
                        </div>
                        <div class="input-box">
                            <p class="title">Prio</p>
                            <div class="prio-btns" id="prio">
                                <div class="prio-btn" id="prioUrgent" onclick="setPrio('urgent')"> Urgent <img src="./assets/images/prioUrgent.png" alt=""></div>
                                <div class="prio-btn" id="prioMedium" onclick="setPrio('medium')"> Medium <img src="./assets/images/prioMedium.png" alt=""></div>
                                <div class="prio-btn" id="prioLow" onclick="setPrio('low')"> Low <img src="./assets/images/prioLow.png" alt=""></div>
                            </div>
                        </div>
                        <div class="input-box">
                            <p class="title">Subtasks</p>
                            <div class="subtasks">
                                <input type="text" placeholder="Add new subtask" id="subTask" maxlength="29" class="input">
                                <img class="plus_image" src="assets/images/plus.svg" onclick="addSubtask()">
                            </div>
                            <div class="subtask_box" id="subtaskBox"></div>
                           
                        </div>
                    </div>
                    <div class="clear_create_task">
                        <div class="clear_button" onclick="closeAddTask()">Close x</div>
                        <div class="create_button" onclick="createTask(${boardPos})">Create<div class="task_text">Task</div><img src="assets/images/haken.png" alt=""></div>
                    </div>
                </form>
            </div>
            <div class="addBord_box" id="addBordBox">
                Task added to Board
                <img src="assets/images/board.png" class="add_board_image">
            </div>
            <div class="addBord_box" id="pleaseEnterName">
                Please enter a Task Name
            </div>
            <div class="addBord_box" id="pleaseCategoryName">
                Please enter a color and a category 
            </div>
            <div class="addBord_box" id="missing">
                Something is missing
            </div>
            <div class="addBord_box" id="emailSend">
                Email sent
            </div>
            <div class="addBord_box" id="enterEmail">
               Please enter a E-Mail
            </div>
        </div>
    </div>    
    `;
    setDateToDueDate();
}

/**
 * Closes the add task overlay.
 */
function closeAddTask() {
    let element = document.getElementById('overlayContent');
    element.classList.add('d-none');
    document.body.classList.remove('overflow');
}