const todoList = document.getElementById("todo-list");
const userTextField = document.getElementById("todo-text");
const submitButton = document.getElementById("todo-submit");

function createTodo(counterId, textValue) {
    return `
        <div class="counter-element" data-id="id-${counterId}">
            <input class="text-area" value="${textValue}"></input>
            <button class="done-button">Done</button>
            <button class="delete-button">Delete</button>
        </div>
    `;
}

function deleteTodo(newTodo) {
    newTodo.remove();
}

function doneTodo(newTodo) {
    const todoText = newTodo.querySelector(".text-area")
    const doneButton = newTodo.querySelector(".done-button");
    if (doneButton.textContent === "Done") {
        doneButton.textContent = "Undone";
        todoText.classList.toggle("strike");
        todoText.disabled = true;
    } else {
        doneButton.textContent = "Done";
        todoText.classList.toggle("strike");
        todoText.disabled = false;
    }
}

function setupEventListener(newTodo) {
    const doneButton = newTodo.querySelector(".done-button");
    const deleteButton = newTodo.querySelector(".delete-button");

    doneButton.addEventListener("click", () => doneTodo(newTodo));
    deleteButton.addEventListener("click", () => deleteTodo(newTodo));
}

function insertTodo() {
    const counterId = document.querySelectorAll('.counter-element').length + 1;
    const textValue = userTextField.value;
    todoList.insertAdjacentHTML("beforeend", createTodo(counterId, textValue));
    setupEventListener(todoList.lastElementChild);
}

submitButton.addEventListener("click", () => insertTodo());