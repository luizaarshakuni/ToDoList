const form = document.querySelector(".minibox");
const tasks = document.querySelector("ul");
const notasks = document.querySelector(".notasks");
const clearBtn = document.querySelector(".clear_btn");

const light = document.getElementById("light");
const dark = document.getElementById("dark");
const body = document.querySelector("body");

let todo_array = [];

function storage() {
  todo_array = [];

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("todo_")) {
      const storedItem = localStorage.getItem(key);
      if (storedItem && storedItem.startsWith("{")) {
        todo_array.push(JSON.parse(storedItem));
      }
    }
  });

  const savedMode = localStorage.getItem("mode");
  if (savedMode === "dark") {
    body.classList.add("dark_mode");
    dark.style.display = "none";
    light.style.display = "block";
  } else {
    body.classList.remove("dark_mode");
    dark.style.display = "block";
    light.style.display = "none";
  }

  showItems();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const [inp] = e.target;
  if (inp.value.trim() === "") {
    inp.classList.add("error");
    return;
  } else {
    inp.classList.remove("error");
  }

  const todo_item = {
    id: new Date().getTime(),
    task: inp.value.trim(),
    isDone: false,
  };

  todo_array.push(todo_item);
  showItems();
  e.target.reset();
});

function showItems() {
  tasks.innerHTML = "";

  notasks.style.display = todo_array.length === 0 ? "block" : "none";

  const isDarkMode = document.body.classList.contains("dark_mode");

  todo_array.forEach((item, index) => {
    let imgSrc = item.isDone
      ? isDarkMode
        ? "./images/darktick.png"
        : "./images/tick.png"
      : "./images/circle.png";
    let checkClass = item.isDone ? "check" : "";

    tasks.innerHTML += `
    <li>
      <img src="${imgSrc}" onclick="toggleTask(${
      item.id
    })" style="border-radius: 50%;">
      <p onclick="toggleTask(${item.id})" class="${checkClass}">
        ${item.task}
      </p>
      <i class="fa-solid fa-pen-to-square ${
        item.isDone ? "disabled" : ""
      }" onclick="editItem(${item.id}, this.parentElement)"></i>
      <i class="fa-solid fa-xmark" onclick="deleteItem(${item.id})"></i>
    </li>
    `;

    localStorage.setItem("todo_" + `${index + 1}`, JSON.stringify(item));
  });
}

function deleteItem(id) {
  const elIndex = todo_array.findIndex((el) => el.id === id);
  if (elIndex !== -1) {
    todo_array.splice(elIndex, 1);
    clearTodoStorage();
    todo_array.forEach((item, index) => {
      localStorage.setItem("todo_" + `${index + 1}`, JSON.stringify(item));
    });
    showItems();
  }
}

function toggleTask(id) {
  let item = todo_array.find((el) => el.id === id);
  if (item) {
    item.isDone = !item.isDone;
    showItems();
  }
}

function editItem(id, element) {
  let item = todo_array.find((el) => el.id === id);
  if (!item || item.isDone) return;

  const input = document.createElement("input");
  input.type = "text";
  input.value = item.task;
  input.classList.add("edit_input");

  let parent = element;
  if (parent.tagName !== "P") {
    parent = parent.querySelector("p");
  }

  parent.replaceWith(input);
  input.focus();

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const newValue = input.value.trim();
      if (newValue) {
        item.task = newValue;
        showItems();
      }
    }
  });
}

clearBtn.addEventListener("click", () => {
  todo_array = [];
  clearTodoStorage();
  showItems();
});

function clearTodoStorage() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("todo_")) {
      localStorage.removeItem(key);
    }
  });
}

function Toggling() {
  body.classList.toggle("dark_mode");

  const isDarkMode = document.body.classList.contains("dark_mode");
  dark.style.display = isDarkMode ? "none" : "block";
  light.style.display = isDarkMode ? "block" : "none";

  localStorage.setItem("mode", isDarkMode ? "dark" : "light");
  showItems();
}

light.addEventListener("click", Toggling);
dark.addEventListener("click", Toggling);

storage();
