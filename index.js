const darkModeButton = document.getElementById("darkMode-btn")
const darkModeImg = document.getElementById("darkMode-img")
const todoList = document.getElementById("todo-list");
const userTextField = document.getElementById("todo-text");
const submitButton = document.getElementById("todo-submit");
const completedBox = document.getElementById("completed-box");
const activeBox = document.getElementById("active-box");

userTextField.value = '';
let todos = [];
let darkMode = false;

// Creates a html containing the to do list
function createTodo(id, text, status) {
    return `
        <div class="counter-element" data-id="id-${id}">
            <div class="todo-button-div">
                <button class="done-button button todo-button">${status ? "❌" : "✔️"}</button>
            </div>
            <input class="text-area ${status ? "strike" : ""}" value="${text}" ${status ? "disabled" : ""}>
            <div class="todo-button-div">
                <button class="delete-button button todo-button">🗑️</button>
            </div>
        </div>
    `;
}

function deleteTodo(todoId) {
    todos = todos.filter(todo => todo.id !== todoId);   // Remove any elements with the same todoId

    saveTodo();
    renderTodos();
}

function doneTodo(todoId) {
    todos = todos.map(todo => {
        if (todo.id === todoId) {
            return { ...todo, status: !todo.status };   // If todoId matches, spreads the object and flipped the 'done' value
        }
        return todo;
    });

    saveTodo();
    renderTodos();
}

function setupEventListener(newTodo, todoId) {
    const doneButton = newTodo.querySelector(".done-button");
    const deleteButton = newTodo.querySelector(".delete-button");
    const todoInput = newTodo.querySelector(".text-area");

    doneButton.addEventListener("click", () => doneTodo(todoId));
    deleteButton.addEventListener("click", () => deleteTodo(todoId));

    // Save the changes made
    todoInput.addEventListener("input", (e) => {
        todos = todos.map(todo => {
            if (todo.id === todoId) {
                return { ...todo, text: e.target.value };
            }
            return todo;
        });

        saveTodo();
    });
}

function insertTodo() {
    if (!userTextField.value) return;
    const textValue = userTextField.value;
    userTextField.value = "";

    const newTodo = {
        id: Date.now(),
        text: textValue,
        status: false
    };

    todos.push(newTodo);

    saveTodo();
    renderTodos();
}

function saveTodo() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos(complete = completedBox.checked, active = activeBox.checked) {
    todoList.innerHTML = "";

    // Rebuild the entire DOM from the "todos" array
    todos.forEach(todo => {
        if (complete === todo.status && complete === true) {
            todoList.insertAdjacentHTML("beforeend", createTodo(todo.id, todo.text, todo.status));
            const newTodo = todoList.lastElementChild;
            setupEventListener(newTodo, todo.id);
        } else if (active === !todo.status && active === true) {
            todoList.insertAdjacentHTML("beforeend", createTodo(todo.id, todo.text, todo.status));
            const newTodo = todoList.lastElementChild;
            setupEventListener(newTodo, todo.id);
        }
    });
}

function changeMode() {
    document.body.className = darkMode ? "dark" : "";
    darkMode ? (darkModeImg.src = "/images/moon.svg") : (darkModeImg.src = "/images/sun.svg");
    localStorage.setItem("darkMode", String(darkMode));
}

submitButton.addEventListener("click", () => insertTodo());
completedBox.addEventListener("change", () => renderTodos(completedBox.checked ? true : false, activeBox.checked));
activeBox.addEventListener("change", () => renderTodos(completedBox.checked, activeBox.checked ? true : false));
darkModeButton.addEventListener("click", () => {
    darkMode = !darkMode;
    changeMode();
});

document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key === "Enter" && userTextField.value && document.activeElement === userTextField) {
        event.preventDefault();
        insertTodo();
    }
})

window.onload = function () {
    const saved = localStorage.getItem("todos");    // Loads from localStorage
    darkMode = localStorage.getItem("darkMode") === "true" ? true : false
    if (darkMode) {
        changeMode();
    }

    if (saved) {
        todos = JSON.parse(saved);
        renderTodos();
    }
}