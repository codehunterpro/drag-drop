const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumn = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;
// Add to column list, Reset textbox
function addToColumn(column) {
  const textItem = addItems[column].textContent;
  const arrayItem = listArrays[column];
  arrayItem.push(textItem);
  listColumn[column].scrollHeight - listColumn[column].clientHeight;
  addItems[column].textContent = "";
  updateDOM();
  listColumn[column].scrollIntoView(false);
}

// Show Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}
// Hide Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}
// Rebuild Array Function
function rebuildArray() {
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push([backlogList.children[i].textContent]);
  }

  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push([progressList.children[i].textContent]);
  }

  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push([completeList.children[i].textContent]);
  }

  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push([onHoldList.children[i].textContent]);
  }

  updateDOM();
}
// When drag the specific element start dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}
//column allows for item to drop
function allowDrop(e) {
  e.preventDefault();
}

// on drag enter
function dragEnter(column) {
  listColumn[column].classList.add("over");
  currentColumn = column;
}
//Dropping Item in column
function drop(e) {
  e.preventDefault();
  // Remove Background color and Padding
  listColumn.forEach((column) => {
    column.classList.remove("over");
  });
  // Add Item to Column
  const parentColumn = listColumn[currentColumn];
  parentColumn.appendChild(draggedItem);
  // dragging complete
  dragging = false;
  rebuildArray();
}
// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  arrayNames.forEach((name, index) => {
    localStorage.setItem(`${name}Items`, JSON.stringify(listArrays[index]));
  });
}
// UpdateItemFunction - Delete if necessary , or update Array Value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  console.log(selectedArray);
  const selectedColumnEl = listColumn[column].children;
  // Delete Item
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      selectedArray.splice(id, 1);
      updateDOM();
    }
    // update Item
    selectedArray.splice(id, 1, selectedColumnEl[id].textContent);
    // update DOM
    updateDOM();
  }
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, Index) => {
    createItemEl(backlogList, 0, backlogItem, Index);
  });
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, Index) => {
    createItemEl(progressList, 1, progressItem, Index);
  });
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, Index) => {
    createItemEl(completeList, 2, completeItem, Index);
  });
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, Index) => {
    createItemEl(onHoldList, 3, onHoldItem, Index);
  });
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// On Load
updateDOM();
