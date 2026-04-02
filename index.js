const todoList = document.getElementById("todo-list");
const textField = document.getElementById("todo-text");
const submitButton = document.getElementById("todo-submit");

function createTodo(counterId, textValue) {
    return `
        <div class="counter-element" data-id="id-${counterId}">
            <text>${textValue}</text>
            <button class="done-button">Done</button>
        </div>
    `;
}

function deleteTodo(newTodo) {
    newTodo.remove();
}

function setupEventListener(newTodo) {
    const doneButton = newTodo.querySelector(".done-button");

    doneButton.addEventListener("click", () => deleteTodo(newTodo));
}

function insertTodo() {
    const counterId = document.querySelectorAll('.counter-element').length + 1;
    const textValue = textField.value;
    todoList.insertAdjacentHTML("beforeend", createTodo(counterId, textValue));
    setupEventListener(todoList.lastElementChild);
}

submitButton.addEventListener("click", () => insertTodo());