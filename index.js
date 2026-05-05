const todoList = document.getElementById("todo-list");
const userTextField = document.getElementById("todo-text");
const submitButton = document.getElementById("todo-submit");
const completedBox = document.getElementById("completed-box");
const activeBox = document.getElementById("active-box");

userTextField.value = '';
let todos = []

async function loadTodos() {
    try {
        const res = await fetch('http://localhost:3000/todos');
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
    }
}

async function deleteTodo(todoId) {
    try {
        await fetch(`http://localhost:3000/todos/${todoId}`, { method: 'DELETE' });
        
        renderTodos();
    } catch (err) {
        console.error(err);
    }
}

async function doneTodo(todoId) {
    try {
        const todo = todos.find(t => t._id === todoId);
        await fetch(`http://localhost:3000/todos/${todoId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: !todo.status })
        })
    
        renderTodos();
    } catch (err) {
        console.error(err);
    }
}

async function insertTodo() {
    try {
        if (!userTextField.value) return;
        const textValue = userTextField.value;
        userTextField.value = "";
    
        const res = await fetch('http://localhost:3000/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textValue })
        });
        
        renderTodos();
    } catch (err) {
        console.error(err);
    }
}

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
    
async function setupEventListener(newTodo, todoId) {
    const doneButton = newTodo.querySelector(".done-button");
    const deleteButton = newTodo.querySelector(".delete-button");
    const todoInput = newTodo.querySelector(".text-area");

    doneButton.addEventListener("click", () => doneTodo(todoId));
    deleteButton.addEventListener("click", () => deleteTodo(todoId));
    
    try {
        // Save the changes made
        todoInput.addEventListener("change", async (e) => {
            await fetch(`http://localhost:3000/todos/${todoId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: e.target.value })
            })
        });
    } catch (err) {
        console.error(err);
    }
}

async function renderTodos(complete = completedBox.checked, active = activeBox.checked) {
    todoList.innerHTML = "";
    
    todos = await loadTodos();

    // Rebuild the entire DOM from the "todos" array
    todos.forEach(todo => {
        if (complete === todo.status && complete === true) {
            todoList.insertAdjacentHTML("beforeend", createTodo(todo._id, todo.text, todo.status));
            const newTodo = todoList.lastElementChild;
            setupEventListener(newTodo, todo._id);
        } else if (active === !todo.status && active === true) {
            todoList.insertAdjacentHTML("beforeend", createTodo(todo._id, todo.text, todo.status));
            const newTodo = todoList.lastElementChild;
            setupEventListener(newTodo, todo._id);
        }
    });
}


submitButton.addEventListener("click", () => insertTodo());
completedBox.addEventListener("change", () => renderTodos(completedBox.checked ? true : false, activeBox.checked));
activeBox.addEventListener("change", () => renderTodos(completedBox.checked, activeBox.checked ? true : false));

document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key === "Enter" && userTextField.value && document.activeElement === userTextField) {
        event.preventDefault();
        insertTodo();
    }
})

window.onload = function () {
    renderTodos();
}