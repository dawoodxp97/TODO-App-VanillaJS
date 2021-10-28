var todoItemsGrp = document.querySelector(".todo_items");
var changeBg = document.getElementById("bg-img");
var rootElem = document.querySelector(":root");
var themeIcon = document.getElementById("theme-icon");
var searchIcon = document.getElementById("search-icon");
var searchGrp = document.getElementById("search-grp");
var searchInp = document.getElementById("search-todo-input");
var totalPendingItems = document.getElementById("pending-items");
var clearBtn = document.getElementById("items-clear");
var editIcon = document.getElementById("edit-icon");
var deleteIcon = document.getElementById("delete-icon");
var modalGrp = document.getElementById("modal-grp");
var modalClose = document.getElementById("modal-close");
var innerModal = document.getElementById("modal-inner");
var modalForm = document.getElementById("modal-form");
var editForm = document.getElementById("edit-form");
var clearSubItems = document.getElementById("clear-sub");
var editInput = document.getElementById("edit-inp");
var pinnedDiv = document.querySelector(".pinned_div");
var sortItems = document.querySelector(".items_statuses");
var btns = sortItems.getElementsByTagName("span");
var searchedTodos = document.getElementById("searched-todos");

// Light / Dark Theme Functions
function changeThemeIcon() {
  if (themeIcon.classList.contains("uil-sun")) {
    themeIcon.classList.remove("uil-sun");
    themeIcon.classList.add("uil-moon");
  } else if (themeIcon.classList.contains("uil-moon")) {
    themeIcon.classList.remove("uil-moon");
    themeIcon.classList.add("uil-sun");
  }
}
function changeThemeBg() {
  if (themeIcon.classList.contains("uil-moon")) {
    changeBg.src = "./assets/images/bg-desktop-light.jpg";
  } else if (themeIcon.classList.contains("uil-sun")) {
    changeBg.src = "./assets/images/bg-desktop-dark.jpg";
  }
}

function changeThemeColor() {
  if (themeIcon.classList.contains("uil-moon")) {
    //This is Light Theme
    rootElem.style.setProperty("--body-color", "hsl(233, 11%, 84%)");
    rootElem.style.setProperty("--light-color", "hsl(0, 0%, 98%)");
    rootElem.style.setProperty("--text-color", "hsl(233, 14%, 35%)");
    rootElem.style.setProperty("--text-color-light", "hsl(234, 39%, 85%)");
    rootElem.style.setProperty("--scroll-bar-color", "hsl(250, 12%, 90%)");
    rootElem.style.setProperty("--scroll-thumb-color", "hsl(250, 12%, 80%)");
  } else if (themeIcon.classList.contains("uil-sun")) {
    //This is Dark Theme
    rootElem.style.setProperty("--body-color", "hsl(235, 21%, 11%)");
    rootElem.style.setProperty("--light-color", "hsl(235, 24%, 19%)");
    rootElem.style.setProperty("--text-color", "hsl(234, 39%, 85%)");
    rootElem.style.setProperty("--text-color-light", "hsl(233, 14%, 35%)");
    rootElem.style.setProperty("--scroll-bar-color", "hsl(250, 12%, 48%)");
    rootElem.style.setProperty("--scroll-thumb-color", "hsl(250, 12%, 36%)");
  }
}

themeIcon.addEventListener("click", () => {
  changeThemeIcon();
  changeThemeBg();
  changeThemeColor();
});

// Firebase Stuff

function getItems() {
  db.collection("todo_items").onSnapshot((snapshot) => {
    let items = [];
    snapshot.docs.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    generateItems(items);
    clearTasksBtn(items);
    sItems = items;
    console.log(sItems);
  });
}

function clearTasksBtn(items) {
  let completed = [];
  items.map((item) => {
    if (item.status === "completed") {
      completed.push(item.id);
    }
  });
  if (completed.length === 0) {
    clearBtn.style.display = "none";
  } else if (completed.length !== 0) {
    clearBtn.style.display = "block";
  }
}

function generateItems(items) {
  let pinnedTodoItems = [];
  let todoItems = [];
  items.forEach((item) => {
    let todoItem = document.createElement("div");
    todoItem.classList.add("todo_item");
    let checkContainer = document.createElement("div");
    checkContainer.classList.add("check");
    let checkMark = document.createElement("div");
    checkMark.classList.add("check_mark");
    checkMark.innerHTML = '<img src="./assets/images/icon-check.svg">';
    checkMark.addEventListener("click", function () {
      markCompleted(item.id);
    });
    checkContainer.appendChild(checkMark);
    let todoText = document.createElement("div");
    todoText.classList.add("todo_text");
    todoText.innerText = item.text;
    if (item.status === "completed") {
      checkMark.classList.add("checked");
      todoText.classList.add("checked");
    }
    let todoIcons = document.createElement("div");
    todoIcons.classList.add("todo_icons");
    let pinDiv = document.createElement("div");
    pinDiv.classList.add("pin-div");
    pinDiv.innerHTML =
      '<img id="pin-icon" src="https://cdn-icons-png.flaticon.com/128/889/889668.png"/>';
    todoIcons.appendChild(pinDiv);
    let cpinDiv = document.createElement("div");
    cpinDiv.classList.add("c_pin_div");
    cpinDiv.innerHTML = "Pin Task";
    cpinDiv.addEventListener("click", function () {
      createPinTask(item?.id);
    });
    todoIcons.appendChild(cpinDiv);
    todoItem.appendChild(checkContainer);
    todoItem.appendChild(todoText);
    todoItem.appendChild(todoIcons);
    if (item?.pinned === false) {
      pinDiv.style.display = "none";
      cpinDiv.style.display = "block";
    } else if (item?.pinned === true) {
      pinDiv.style.display = "block";
      cpinDiv.style.display = "none";
    }
    pinDiv.addEventListener("click", function () {
      removePinTask(item?.id);
    });

    if (item?.status === "active") {
      todoText.addEventListener("click", function () {
        openModal(item);
      });
      todoItem.classList.add("active_task");
    } else if (item?.status === "completed") {
      todoItem.classList.add("completed_task");
    }
    if (item?.pinned === false) {
      todoItems.push(todoItem);
    } else if (item?.pinned === true) {
      pinnedTodoItems.push(todoItem);
    }
  });
  pinnedDiv.replaceChildren(...pinnedTodoItems);
  todoItemsGrp.replaceChildren(...todoItems);
}

function removePinTask(id) {
  db.collection("todo_items").doc(id).set(
    {
      pinned: false,
    },
    { merge: true }
  );
}

function createPinTask(id) {
  db.collection("todo_items").doc(id).set(
    {
      pinned: true,
    },
    { merge: true }
  );
}

// Function for Edit and Delete Actions
function iconsAction(id, type) {
  if (type === "edit") {
    editIcon.onclick = function (event) {
      editInput.style.display = "block";
      editForm.addEventListener("submit", editTodo);
      function editTodo(e) {
        e.preventDefault();
        let updateText = editInput.value;
        let updateTodo = db
          .collection("todo_items")
          .doc(id)
          .update({
            text: updateText,
          })
          .then(() => {
            //Document successfully updated!
            editInput.value = "";
            modalGrp.style.display = "none";
          });
      }
      event.cancelBubble = true;
    };
  } else if (type === "delete") {
    deleteIcon.onclick = function (event) {
      db.collection("todo_items")
        .doc(id)
        .delete()
        .then(() => {
          // Document successfully deleted!
          modalGrp.style.display = "none";
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });

      event.cancelBubble = true;
    };
  }
}

function addItem(event) {
  event.preventDefault();
  let text = document.getElementById("todo-input");
  let newItem = db.collection("todo_items").doc().set(
    {
      pinned: false,
      text: text.value,
      status: "active",
    },
    { merge: true }
  );
  text.value = "";
  toast("Todo Created");
}

function markCompleted(id) {
  let item = db.collection("todo_items").doc(id);
  item.get().then(function (doc) {
    if (doc.exists) {
      if (doc.data().status == "active") {
        item.update({
          status: "completed",
        });
      } else {
        item.update({
          status: "active",
        });
      }
    }
  });
}
function clearCompleted() {
  var completedDoc = db
    .collection("todo_items")
    .where("status", "==", "completed");
  completedDoc
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (doc.exists) {
          doc.ref.delete();
        }
      });
      toast("Tasks Cleared");
    })
    .catch((err) => {
      console.log(err);
    });
}

function toast(text) {
  Toastify({
    text: text,
    duration: 1000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    stopOnFocus: true,
  }).showToast();
}

function checkPending() {
  let totalLeftItems = [];
  db.collection("todo_items").onSnapshot((snapshot) => {
    snapshot.docs.forEach((doc) => {
      if (doc.exists) {
        if (doc.data().status === "active") {
          totalLeftItems.push(doc.data());
          totalPendingItems.innerHTML = `${totalLeftItems.length} items left`;
        }
      }
      if (totalLeftItems.length === 0) {
        totalPendingItems.innerHTML = `0 items left`;
      }
    });
    totalLeftItems = [];
  });
}

function openModal(item) {
  modalGrp.style.display = "block";
  var todoName = document.querySelector("#todo-name");
  todoName.innerHTML = item.text;
  editIcon.addEventListener("click", function () {
    iconsAction(item.id, "edit");
  });
  deleteIcon.addEventListener("click", function () {
    iconsAction(item.id, "delete");
  });
  handleSubtodo(item.id);
  modalForm.addEventListener("submit", addSubItem);
  function addSubItem(event) {
    event.preventDefault();
    const text = document.getElementById("modal-inp");
    const newItem = db
      .collection("todo_items")
      .doc(item.id)
      .collection("subtask")
      .doc()
      .set(
        {
          text: text.value,
          status: "active",
        },
        { merge: true }
      )
      .then(() => {
        //Task Added
        text.value = "";
      });
  }
  clearSubItems.addEventListener("click", function () {
    clearSubCompleted(item.id);
  });
}

function handleSubtodo(id) {
  db.collection("todo_items")
    .doc(id)
    .collection("subtask")
    .onSnapshot((snapshot) => {
      let subItems = [];
      snapshot.docs.forEach((doc) => {
        subItems.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      generateSubTodoItems(subItems, id);
      clearSubTasksBtn(subItems);
    });
}

function generateSubTodoItems(subItems, id) {
  let subTodoItems = [];
  subItems.forEach((item) => {
    let subTodoItem = document.createElement("div");
    subTodoItem.classList.add("todo_item");
    let checkContainer = document.createElement("div");
    checkContainer.classList.add("check");
    let checkMark = document.createElement("div");
    checkMark.classList.add("check_mark");
    checkMark.innerHTML = '<img src="./assets/images/icon-check.svg">';
    checkMark.addEventListener("click", function () {
      markSubItemComplete(item.id, id);
    });
    checkContainer.appendChild(checkMark);
    let todoText = document.createElement("div");
    todoText.classList.add("todo_text");
    todoText.classList.add("sub_todo");
    todoText.addEventListener("click", function () {
      console.log(item?.id);
    });
    todoText.innerText = item.text;
    if (item.status === "completed") {
      checkMark.classList.add("checked");
      todoText.classList.add("checked");
    }
    subTodoItem.appendChild(checkContainer);
    subTodoItem.appendChild(todoText);
    subTodoItems.push(subTodoItem);
  });
  document.querySelector(".sub_todo_items").replaceChildren(...subTodoItems);
}

function markSubItemComplete(id, mainId) {
  let item = db
    .collection("todo_items")
    .doc(mainId)
    .collection("subtask")
    .doc(id);
  item.get().then(function (doc) {
    if (doc.exists) {
      if (doc.data().status == "active") {
        item.update({
          status: "completed",
        });
      } else {
        item.update({
          status: "active",
        });
      }
    }
  });
}

function clearSubCompleted(id) {
  var completedDoc = db
    .collection("todo_items")
    .doc(id)
    .collection("subtask")
    .where("status", "==", "completed");
  completedDoc
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (doc.exists) {
          doc.ref.delete();
        }
      });
      toast("Tasks Cleared");
    })
    .catch((err) => {
      console.log(err);
    });
}
function clearSubTasksBtn(items) {
  let completed = [];
  items.map((item) => {
    if (item.status === "completed") {
      completed.push(item.id);
    }
  });
  if (completed.length === 0) {
    clearSubItems.style.display = "none";
  } else if (completed.length !== 0) {
    clearSubItems.style.display = "block";
  }
}

modalClose.addEventListener("click", function () {
  editInput.style.display = "none";
  modalGrp.style.display = "none";
});

function getSort() {
  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      const current = document.getElementsByClassName("active");
      const comElems = document.getElementsByClassName("completed_task");
      const actElems = document.getElementsByClassName("active_task");
      current[0].className = current[0].className.replace("active", "");
      this.className += " active";
      if (this.classList.contains("act")) {
        for (let a = 0; a < comElems.length; a++) {
          comElems[a].style.display = "none";
        }
        for (let b = 0; b < actElems.length; b++) {
          actElems[b].style.display = "flex";
        }
      } else if (this.classList.contains("com")) {
        for (let a = 0; a < comElems.length; a++) {
          comElems[a].style.display = "flex";
        }
        for (let b = 0; b < actElems.length; b++) {
          actElems[b].style.display = "none";
        }
      } else if (this.classList.contains("all")) {
        for (let a = 0; a < comElems.length; a++) {
          comElems[a].style.display = "flex";
        }
        for (let b = 0; b < actElems.length; b++) {
          actElems[b].style.display = "flex";
        }
      }
    });
  }
}
searchIcon.addEventListener("click", function () {
  if (searchGrp.style.display !== "none") {
    searchGrp.style.display = "none";
  } else {
    searchGrp.style.display = "block";
  }
});

function displaySearched(items) {
  let searchedItems = [];
  items.forEach((item) => {
    let sItem = document.createElement("div");
    sItem.classList.add("searched_item");
    sItem.setAttribute("id", "searched-item");
    let sHead = document.createElement("h3");
    sHead.innerText = item.text;
    sItem.appendChild(sHead);
    sItem.addEventListener("click", function () {
      openModal(item);
    });
    searchedItems.push(sItem);
  });
  searchedTodos.replaceChildren(...searchedItems);
}
searchInp.addEventListener("keyup", (e) => {
  const searchString = e.target.value.toLowerCase();
  const filteredItems = sItems.filter((res) => {
    return res.text.toLowerCase().includes(searchString);
  });
  if (!searchString) {
    displayEmptySearched();
  } else {
    displaySearched(filteredItems);
  }
});

function displayEmptySearched() {
  searchedTodos.innerHTML = "";
  let emp = document.createElement("div");
  emp.classList.add("empty_list");
  let empText = document.createElement("div");
  empText.innerText = "Please type to search...";
  emp.appendChild(empText);
  searchedTodos.appendChild(emp);
}

getSort();
checkPending();
getItems();
