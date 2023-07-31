let numInProgress = 0;
let numFeedback = 0;
let numTodos = 0;
let numDone = 0;

/**
 * Event listener function that is triggered when the window finishes loading.
 * It performs the following operations:
 * 1. Waits for the required data to be loaded using the 'loadRequiredData' function.
 * 2. Sets the greeting name using the 'setGreetingName' function.
 * 3. Calls the 'greet' function to display a greeting message.
 * 4. Calls the 'counts' function to perform any necessary counting operations.
 */
window.addEventListener('load', async function () {
    await loadRequiredData();
    setGreetingName();
    greet()
    counts();
});

/**
 * Sets the greeting name on the webpage by updating the innerHTML of the element with the ID 'greeting'.
 * The greeting name is retrieved from the 'currentUser' variable.
 */
function setGreetingName() {
    document.getElementById('greeting').innerHTML = currentUser;
}

/**
 * Performs counting operations by calling the following functions:
 * 1. Calls the 'numberOfTasks' function to count the number of tasks.
 * 2. Calls the 'countOtherWorkStep' function to perform counting related to other work steps.
 * 3. Calls the 'setUrgentAndDate' function to set the urgency and date related counts.
 */
function counts() {
    numberOfTasks();
    countOhterWorkStep();
    setUrgentAndDate();
}

/**
 * Displays the number of tasks on the webpage by updating the innerHTML of the element with the ID 'entireTasks'.
 * The number of tasks is determined by the length of the 'tasks' array.
 */
function numberOfTasks() {
    document.getElementById('entireTasks').innerHTML = tasks.length;
}

/**
 * Counts the number of tasks in each work step category and updates the corresponding counters.
 * The function iterates over each task and increments the counters based on the work step category of the task.
 * The counters are then updated by calling the 'updateTaskCounters' function.
 */
function countOhterWorkStep() {
    tasks.forEach(e => {
        switch (e.split) {
            case 'inprogressContainer':
                numInProgress++
                break;
            case 'todoContainer':
                numTodos++
                break;
            case 'awaitingFeedbackContainer':
                numFeedback++
                break;
            case 'doneContainer':
                numDone++
                break;
            default:
                break;
        }
    });
    updateTaskCounters();
}

/**
 * Updates the task counters on the webpage.
 */
function updateTaskCounters() {
    document.getElementById('inProgress').innerHTML = numInProgress;
    document.getElementById('feedback').innerHTML = numFeedback;
    document.getElementById('todos').innerHTML = numTodos;
    document.getElementById('done').innerHTML = numDone;
}

  /**
 * Sets the counts and date related information on the webpage.
 * It performs the following operations:
 * - Initializes variables for counting urgent tasks, earliest date, and formatted date.
 * - If there are tasks present:
 *   - Counts the number of tasks with priority set as "urgent" using the `filter` method.
 *   - Sorts the tasks based on the date in ascending order and retrieves the earliest date.
 *   - Formats the earliest date using the `toLocaleDateString` method.
 * - Updates the innerHTML of the elements with the IDs 'numUrgent' and 'deadlineDate' to reflect the counts and date information.
 */
function setUrgentAndDate() {
    let urgentCount = 0;
    let earliestDate = null;
    let formattedDate = "";  
    if (tasks.length > 0) {
      urgentCount = tasks.filter(task => task.prio === "urgent").length;  
      let sortedTasks = tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
      earliestDate = sortedTasks[0].date;
      let dateObj = new Date(earliestDate);
      let options = { month: "long", day: "numeric", year: "numeric" };
      formattedDate = dateObj.toLocaleDateString("en-us", options);
    }  
    document.getElementById('numUrgent').innerHTML = urgentCount;
    document.getElementById('deadlineDate').innerHTML = formattedDate;
}

/**
 * Redirects the user to the 'board.html' page.
 */
function loadBoard() {
    window.location.href = 'board.html';
}

/**
 * Sets the greeting message based on the current time of the day.
 * It retrieves the current hour and determines the appropriate greeting based on the following conditions:
 * - If the current hour is between 3 AM (inclusive) and 12 PM (exclusive), it sets the greeting message as "Good Morning".
 * - If the current hour is between 12 PM (inclusive) and 6 PM (exclusive), it sets the greeting message as "Good Afternoon".
 * - If the current hour is between 6 PM (inclusive) and 12 AM (exclusive), it sets the greeting message as "Good Evening".
 * - If the current hour is between 12 AM (inclusive) and 3 AM (exclusive), it sets the greeting message as "Good Evening".
 * The greeting message is then updated by setting the innerHTML of the element with the ID 'greet'.
 */
function greet() {
    currentlyDate = new Date();
    curentlyHour = currentlyDate.getHours();
    if (curentlyHour >= 3 && curentlyHour < 12) document.getElementById('greet').innerHTML = `Good Morning,`;
    if (curentlyHour >= 12 && curentlyHour < 18) document.getElementById('greet').innerHTML = `Good afternoon,`;
    if (curentlyHour >= 18) document.getElementById('greet').innerHTML = `Good evening,`;
    if (curentlyHour >= 0 && curentlyHour < 3) document.getElementById('greet').innerHTML = `Good evening,`;
};