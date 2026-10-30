
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const taskCount = document.getElementById("taskCount");
const remainingText = document.getElementById("remainingText");
const clearCompletedBtn = document.getElementById("clearCompleted");

let tasks = [];
let currentFilter = "all";
let nextId = 1;

// Add a new task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    tasks.push({
        id: nextId++,
        text: text,
        completed: false
    });

    taskInput.value = "";
    renderTasks();
    taskInput.focus();
});

// Display tasks according to the selected filter
function renderTasks() {
    taskList.replaceChildren();

    const filteredTasks = tasks.filter(function (task) {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(function (task) {
        const item = document.createElement("li");
        item.className = "task";

        if (task.completed) {
            item.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task completed");

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            renderTasks();
        });

        const text = document.createElement("span");
        text.className = "task-text";
        text.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", "Delete " + task.text);

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(function (t) {
                return t.id !== task.id;
            });

            renderTasks();
        });

        item.append(checkbox, text, deleteButton);
        taskList.appendChild(item);
    });

    emptyState.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    if (filteredTasks.length === 0) {
        const heading = emptyState.querySelector("h2");
        const message = emptyState.querySelector("p");

        if (tasks.length === 0) {
            heading.textContent = "No tasks yet";
            message.textContent = "Add a task above to get started.";
        } else if (currentFilter === "active") {
            heading.textContent = "All caught up!";
            message.textContent = "There are no active tasks.";
        } else if (currentFilter === "completed") {
            heading.textContent = "Nothing completed yet";
            message.textContent = "Completed tasks will appear here.";
        }
    }

    updateProgress();
}

// Update task counts and progress bar
function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const remaining = total - completed;
    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    progressText.textContent = percentage + "% completed";
    progressBar.style.width = percentage + "%";

    taskCount.textContent =
        total + (total === 1 ? " task added" : " tasks added");

    remainingText.textContent =
        remaining + (remaining === 1 ? " task remaining" : " tasks remaining");
}

// Change the current filter
document.querySelectorAll(".filter").forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        document.querySelectorAll(".filter").forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");
        renderTasks();
    });
});

// Remove all completed tasks
clearCompletedBtn.addEventListener("click", function () {
    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    renderTasks();
});

// Initial display
renderTasks();