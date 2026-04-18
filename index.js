const todoList = document.getElementById("todo-list");
const userTextField = document.getElementById("todo-text");
const submitButton = document.getElementById("todo-submit");
const completedBox = document.getElementById("completed-box");
const activeBox = document.getElementById("active-box");

let todos = []

async function loadTodos() {
    const res = await fetch('http://localhost:3000/todos');
    const data = await res.json();
    return data;
}

async function deleteTodo(todoId) {
    await fetch(`http://localhost:3000/todos/${todoId}`, { method: 'DELETE' });
    
    renderTodos();
}

async function doneTodo(todoId) {
    const todo = todos.find(t => t.id === todoId);
    await fetch(`http://localhost:3000/todos/${todoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: !todo.status })
    })

    renderTodos();
}

async function insertTodo() {
    const textValue = userTextField.value;
    userTextField.value = "";

    const res = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textValue })
    });
    
    renderTodos();
}

// Creates a html containing the to do list
function createTodo(id, text, status) {
    return `
        <div class="counter-element" data-id="id-${id}">
        <button class="done-button button">${status ? "❌" : "✔️"}</button>
        <input class="text-area ${status ? "strike" : ""}" value="${text}" ${status ? "disabled" : ""}>
        <button class="delete-button button">🗑️</button>
        </div>
    `;
}
    
function setupEventListener(newTodo, todoId) {
    const doneButton = newTodo.querySelector(".done-button");
    const deleteButton = newTodo.querySelector(".delete-button");

    doneButton.addEventListener("click", () => doneTodo(todoId));
    deleteButton.addEventListener("click", () => deleteTodo(todoId));
}

async function renderTodos(complete = completedBox.checked, active = activeBox.checked) {
    todoList.innerHTML = "";
    
    todos = await loadTodos();

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


submitButton.addEventListener("click", () => insertTodo());
completedBox.addEventListener("change", () => renderTodos(completedBox.checked ? true : false, activeBox.checked));
activeBox.addEventListener("change", () => renderTodos(completedBox.checked, activeBox.checked ? true : false));

document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key === "Enter") {
        event.preventDefault();
        insertTodo();
    }
})

window.onload = function () {
    renderTodos();
}