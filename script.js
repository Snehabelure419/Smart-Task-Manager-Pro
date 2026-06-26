const taskInput = document.getElementById("taskInput");
const description = document.getElementById("description");
const priority = document.getElementById("priority");
const category = document.getElementById("category");
const dueDate = document.getElementById("dueDate");

const addTask = document.getElementById("addTask");
const taskContainer = document.getElementById("taskContainer");

const search = document.getElementById("search");
const filter = document.getElementById("filter");

const totalTask = document.getElementById("totalTask");
const completedTask = document.getElementById("completedTask");
const pendingTask = document.getElementById("pendingTask");
const progressBar = document.getElementById("progressBar");
const percent = document.getElementById("percent");
const taskCount = document.getElementById("taskCount");

const themeBtn = document.getElementById("themeBtn");
const clearAll = document.getElementById("clearAll");
const greeting = document.getElementById("greeting");
const clock = document.getElementById("clock");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

showGreeting();
showClock();
loadTheme();
renderTasks();

addTask.addEventListener("click", () => {

    if (taskInput.value.trim() === "") {
        alert("Please Enter Task Name");
        return;
    }

    const task = {

        id: Date.now(),

        title: taskInput.value,

        desc: description.value,

        priority: priority.value,

        category: category.value,

        due: dueDate.value,

        completed: false

    };

    tasks.push(task);

    saveTasks();

    clearInputs();

    renderTasks();

});

function clearInputs() {

    taskInput.value = "";

    description.value = "";

    priority.value = "High";

    category.value = "Study";

    dueDate.value = "";

}

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

function renderTasks() {

    taskContainer.innerHTML = "";

    tasks.sort((a, b) => new Date(a.due) - new Date(b.due));

    tasks.forEach(task => {

        createTaskCard(task);

    });

    updateStats();

}
function createTaskCard(task) {

    let keyword = search.value.toLowerCase();

    if (!task.title.toLowerCase().includes(keyword) &&
        !task.desc.toLowerCase().includes(keyword)) {
        return;
    }

    if (filter.value === "completed" && !task.completed) {
        return;
    }

    if (filter.value === "pending" && task.completed) {
        return;
    }

    const card = document.createElement("div");

    card.className = "task";

    if (task.completed) {
        card.classList.add("completed");
    }

    card.innerHTML = `

        <h3>${task.title}</h3>

        <p>${task.desc}</p>

        <p><b>Category :</b> ${task.category}</p>

        <p><b>Priority :</b>
            <span class="priority ${task.priority.toLowerCase()}">
                ${task.priority}
            </span>
        </p>

        <p><b>Due :</b> ${task.due || "No Due Date"}</p>

        <div class="buttons">

            <button class="complete">
                ${task.completed ? "Undo" : "Complete"}
            </button>

            <button class="edit">
                Edit
            </button>

            <button class="delete">
                Delete
            </button>

        </div>

    `;

    card.querySelector(".complete").onclick = () => {

        task.completed = !task.completed;

        saveTasks();

        renderTasks();

    };

    card.querySelector(".delete").onclick = () => {

        if (confirm("Delete this task?")) {

            tasks = tasks.filter(t => t.id !== task.id);

            saveTasks();

            renderTasks();

        }

    };

    card.querySelector(".edit").onclick = () => {

        taskInput.value = task.title;

        description.value = task.desc;

        priority.value = task.priority;

        category.value = task.category;

        dueDate.value = task.due;

        tasks = tasks.filter(t => t.id !== task.id);

        saveTasks();

        renderTasks();

    };

    taskContainer.appendChild(card);

}

search.addEventListener("input", renderTasks);

filter.addEventListener("change", renderTasks);

clearAll.addEventListener("click", () => {

    if (tasks.length === 0) {

        alert("No Tasks Available");

        return;

    }

    if (confirm("Delete All Tasks?")) {

        tasks = [];

        saveTasks();

        renderTasks();

    }

});
function updateStats() {

    totalTask.innerText = tasks.length;

    let completed = tasks.filter(task => task.completed).length;

    completedTask.innerText = completed;

    pendingTask.innerText = tasks.length - completed;

    let percentage = 0;

    if (tasks.length > 0) {

        percentage = Math.round((completed / tasks.length) * 100);

    }

    progressBar.style.width = percentage + "%";

    percent.innerText = percentage + "% Completed";

    taskCount.innerText = "You have " + tasks.length + " Task(s)";

}

function showGreeting() {

    let hour = new Date().getHours();

    let message = "";

    if (hour < 12) {

        message = "🌞 Good Morning";

    }
    else if (hour < 17) {

        message = "☀ Good Afternoon";

    }
    else if (hour < 21) {

        message = "🌇 Good Evening";

    }
    else {

        message = "🌙 Good Night";

    }

    greeting.innerText = message;

}

function showClock() {

    function updateClock() {

        let now = new Date();

        clock.innerText =
            now.toLocaleDateString() +
            " | " +
            now.toLocaleTimeString();

    }

    updateClock();

    setInterval(updateClock, 1000);

}

function loadTheme() {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    }

}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    }
    else {

        localStorage.setItem("theme", "light");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

});

window.addEventListener("load", () => {

    renderTasks();

});