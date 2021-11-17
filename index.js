const taskContainer = document.querySelector(".task__container");
// const searchBar = document.getElementById("searchBar");
const taskModal = document.querySelector(".task__modal__body");

let globalTaskData = []; //global array

const generateHtml = (taskData) => {
  return `<div id=${taskData.id} class="col-md-6 col-lg-4 my-4">
<div class="card shadow-sm task__card">
  <div class="card-header gap-2 d-flex justify-content-end">
    <button class="btn btn-outline-info" name=${taskData.id} onclick="editCard.apply(this, arguments)">
      <i class="fal fa-pencil name=${taskData.id}"></i>
    </button>
    <button class="btn btn-outline-danger" name=${taskData.id} onclick="deleteCard.apply(this, arguments)">
      <i class="far fa-trash-alt" name=${taskData.id}></i>
    </button>
  </div>
  <div class="card-body">
  
      ${taskData.image  &&
        `          <img width="100%" src=${taskData.image} alt="Card image cap" class="card-img-top mb-3 rounded-lg">`}
      
    <h5 class="card-title mt-4">${taskData.title}</h5>
    <p class="card-text">${taskData.description}</p>
    <span class="badge bg-primary">${taskData.type}</span>
  </div>
  <div class="card-footer">
    <button class="btn btn-outline-primary" id=${taskData.id} data-bs-toggle="modal" data-bs-target="#showTask" onclick="openTask.apply(this, arguments)" >Open Task</button>
  </div>
</div>
</div>`;
};

//stringify - to convert js to string format
const saveToLocalStorage = () =>
  localStorage.setItem("taskyCA", JSON.stringify({ card: globalTaskData }));

const insertToDOM = (content) =>
  taskContainer.insertAdjacentHTML("beforeend", content);

const addNewCard = () => {
  //get task data for card
  const taskData = {
    id: `${Date.now()}`, //will provide milisec 87897789 unique every single time
    title: document.getElementById("taskTitle").value,
    image: document.getElementById("imageURL").value,
    type: document.getElementById("taskType").value,
    description: document.getElementById("taskDescription").value,
  };

  globalTaskData.push(taskData);

  //Update local storage
  //taskyCA is a key to identifymy data
  saveToLocalStorage();

  //generate html code

  const newCard = generateHtml(taskData);

  //inject it to dom

  insertToDOM(newCard);

  //clear the form

  document.getElementById("taskTitle").value = "";
  document.getElementById("imageURL").value = "";
  document.getElementById("taskType").value = "";
  document.getElementById("taskDescription").value = "";

  return;
};

const loadExistingCards = () => {
  // check local storage
  //getItem is used to get item from local storage
  const getData = localStorage.getItem("taskyCA");

  // Parse Json data,if exist
  if (!getData) return;

  //parse converts json to javascript
  const taskCards = JSON.parse(getData);

  globalTaskData = taskCards.card;

  // generate Html code for those data
  globalTaskData.map((taskData) => {
    const newCard = generateHtml(taskData);

    //inject to the DOM
    insertToDOM(newCard);
  });

  return;
};
//event is a predefined object applicable in dom
const deleteCard = (event) => {
  const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;

  //filter will check if target id not equal to task id then will get saved in remove task
  const removeTask = globalTaskData.filter((task) => task.id !== targetID);
  globalTaskData = removeTask;

  saveToLocalStorage();

  //access DOM to remove card
  if (elementType === "BUTTON") {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode
    );
  }
  //if clicks icon
  else {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode.parentNode
    );
  }
};

const editCard = (event) => {
  // const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;

  let taskTitle;
  let taskType;
  let taskDescription;
  let parentElement;
  let submitButton;

  if (elementType == "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentElement.childNodes[3].childNodes[3];
  taskDescription = parentElement.childNodes[3].childNodes[5];
  taskType = parentElement.childNodes[3].childNodes[7];
  submitButton = parentElement.childNodes[5].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};

const saveEdit = (event) => {
  const targetID = event.target.id;
  const elementType = event.target.tagName;

  let parentElement;

  if (elementType === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  const taskTitle = parentElement.childNodes[3].childNodes[3];
  const taskDescription = parentElement.childNodes[3].childNodes[5];
  const taskType = parentElement.childNodes[3].childNodes[7];
  const submitButton = parentElement.childNodes[5].childNodes[1];

  //data of card updated
  const updatedData = {
    title: taskTitle.innerHTML,
    type: taskType.innerHTML,
    description: taskDescription.innerHTML,
  };

  console.log({ updatedData, targetID });

  //updated data if it is updated else te same task data
  const updateGlobalTasks = globalTaskData.map((task) => {
    if (task.id === targetID) {
      return { ...task, ...updatedData };
    }
    return task;
  });

  globalTaskData = updateGlobalTasks;

  saveToLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showTask");
  submitButton.innerHTML = "Open Task";
};

// searchBar.addEventListener("keyup", function (e) {
//   if (!e) e = window.event;
//   while (taskContainer.firstChild) {
//     taskContainer.removeChild(taskContainer.firstChild);
//   }
//   const searchString = e.target.value;
//   // console.log(searchString);
//   const filteredCharacters = globalTaskData.filter(function (character) {
//     return (
//       character.title.toLowerCase().includes(searchString) ||
//       character.description.toLowerCase().includes(searchString) ||
//       character.type.toLowerCase().includes(searchString)
//     );
//   });
//   filteredCharacters.map(function (cardData) {
//     taskContainer.insertAdjacentHTML("beforeend", generateHTML(cardData));
//   });
// });

const openTask = (e) => {
  if (!e) e = window.event;

  const getTask = globalTaskData.filter(({id}) => id ===  e.target.id );
  taskModal.innerHTML = openModalContent(getTask[0]);
};

const openModalContent = (taskData) => {
  const date = new Date(parseInt(taskData.id));
  return ` <div id=${taskData.id}>
  <img
  src=${
    taskData.image ||
    `https://images.unsplash.com/photo-1572214350916-571eac7bfced?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=755&q=80`
  }
  alt="bg image"
  class=" place__holder__image mb-3"
  >
  <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
  <h2 class="my-3">${taskData.title}</h2>
  <p class="lead">
  ${taskData.description}
  </p></div>`;
};
//contenteditable - to edit if set true content can be changed dynamically by user

//Parse => JSON to Js object