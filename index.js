const todoList = document.getElementById("todo-list");
const userTextField = document.getElementById("todo-text");
const submitButton = document.getElementById("todo-submit");

let todos = [];

// Creates a html containing the to do list
function createTodo(id, text, status) {
    return `
        <div class="counter-element" data-id="id-${id}">
            <input class="${status ? "strike" : ""}" value="${text}" ${status ? "disabled" : ""}>
            <button class="done-button">${status ? "Undone" : "Done"}</button>
            <button class="delete-button">Delete</button>
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
            return { ...todo, done: !todo.done };   // If todoId matches, spreads the object and flipped the 'done' value
        }
        return todo;
    });

    saveTodo();
    renderTodos();
}

function setupEventListener(newTodo, todoId) {
    const doneButton = newTodo.querySelector(".done-button");
    const deleteButton = newTodo.querySelector(".delete-button");

    doneButton.addEventListener("click", () => doneTodo(todoId));
    deleteButton.addEventListener("click", () => deleteTodo(todoId));
}

function insertTodo() {
    const textValue = userTextField.value;

    const newTodo = {
        id: Date.now(),
        text: textValue,
        done: false
    };

    todos.push(newTodo);

    saveTodo();
    renderTodos();
}

function saveTodo() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = "";

    // Rebuild the entire DOM from the "todos" array
    todos.forEach(todo => {
        todoList.insertAdjacentHTML("beforeend", createTodo(todo.id, todo.text, todo.done));
        const newTodo = todoList.lastElementChild;
        setupEventListener(newTodo, todo.id);
    });
}

submitButton.addEventListener("click", () => insertTodo());

window.onload = function () {
    const saved = localStorage.getItem("todos");    // Loads from localStorage

    if (saved) {
        todos = JSON.parse(saved);
        renderTodos();
    }
}