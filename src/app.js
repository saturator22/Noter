class App {
    constructor(tasksArr) {
        this.eventHandler = new EventHandler(tasksArr);
    }
    
    renderTasks() {
        let tasksContainer = document.getElementById("tasksContainer");
        tasksContainer.innerHTML = "";

        let tasks = JSON.parse(localStorage.getItem("task"));

        tasks.forEach(element => {
            element.id = tasks.findIndex(i => i === element);

            let task = this.generateTask(element);
            
            tasksContainer.appendChild(task);            
        });
        localStorage.setItem("task", JSON.stringify(tasks));
    }    
    
    
    setEventHandlers(taskToRender, elementID) {
        let task = taskToRender;
        console.log(task);
        let crossSign = task.querySelector("#cross" + elementID);
        let headerClick = task.querySelector("#header" + elementID);
        let contentClick = task.querySelector("#content" + elementID);
        
        let scope = this;

        crossSign.addEventListener("click", function() {
          scope.removeTask(this);
        });

        headerClick.addEventListener("blur", function() {
            scope.editTaskHeader(this);
        }, false);
        headerClick.focus();

        contentClick.addEventListener("blur", function() {
            scope.editTaskContent(this);
        }, false);
        contentClick.focus();
        
        return task;
    }
    
    generateTask(task){
        
        let taskHtml = `<div class="card card-background-color draggable">
        <header class="card-header">
        <p id="header${task.id}" class="card-header-title p-style" contenteditable="true">${task.header}</p>
        <img id="cross${task.id}" class="cross" src="crossy.png">
        </header>
        <div class="content-style">
        <div id="content${task.id}" class="content d-style" contenteditable="true">${task.content}</div>
        <time class="t-style" datetime="2016-1-1">${task.date}</time>
        </div>
        </div>`;
        
        let template = document.createElement('template');
        template.innerHTML = taskHtml;
        template = this.setEventHandlers(template.content, task.id);

        return template;
    }
    
    getID(event) {
        let elementID = event.id;
        elementID = elementID.match(/\d+/g);
        elementID = elementID[0];

        return elementID;
    }

    removeTask(event) {
        let elementID = this.getID(event);

        this.eventHandler.removeFromList(elementID);
        this.renderTasks();
    }
    addTask(event) {
        this.eventHandler.addTaskToList();
        this.renderTasks();
    }

    editTaskHeader(event) {
        let elementID = this.getID(event);
        
        this.removeAttrAndEventListenerFromEditable(event);
        
        let toEdit = event.innerHTML;
        
        this.eventHandler.editHeader(elementID, toEdit);
        this.renderTasks();
    }
    
    editTaskContent(event) {
        let elementID = this.getID(event);

        this.removeAttrAndEventListenerFromEditable(event);
        
        let toEdit = event.innerHTML;
        
        this.eventHandler.editContent(elementID, toEdit);
        this.renderTasks();
    }
    
    removeAttrAndEventListenerFromEditable(event) {
        event.removeAttribute("contenteditable");
        event.removeEventListener('blur', event.target);
    }
    
}

class EventHandler {
    constructor(tasksList) {
        this.tasksList = tasksList;
    }
    
    removeFromList(elementID) {
        let afterRemove = this.tasksList;
        afterRemove.splice(elementID, 1);

        localStorage.setItem("task", JSON.stringify(afterRemove));
    }
    
    addTaskToList() {
        let task = new Task("", "", this.tasksList.length);
        this.tasksList.push(task);
        localStorage.setItem("task", JSON.stringify(this.tasksList));
    }
    
    editHeader(elementID, toEdit) {
        this.editTask(elementID, toEdit, "header");
        localStorage.setItem("task", JSON.stringify(this.tasksList));
    }
    
    editContent(elementID, toEdit) {
        this.editTask(elementID, toEdit, "content");
        localStorage.setItem("task", JSON.stringify(this.tasksList))
    }
    
    editTask(elementID, toEdit, fieldName) {

        let task = this.tasksList[elementID];
        
        if(fieldName == "header") {
            task.header = toEdit;
        } else {
            task.content = toEdit;
        }
        this.tasksList[elementID] = task;
    }
}

class Task {
    constructor(header, content, id) {
        this.id = id;
        this.header = header;
        this.content = content;
        this.date = this.getDateTime();
    }
    
    getDateTime() {
        let dateTime = new Date();
        let dd = dateTime.getDate();
        let mm = dateTime.getMonth();
        let yyyy = dateTime.getFullYear();
        let curHour = dateTime.getHours();
        let curMin = dateTime.getMinutes();
        let curSec = dateTime.getSeconds();
        
        return dd + "/" + mm + "/" + yyyy + "  " + curHour + ":" + curMin + ":" + curSec;
    }
}

window.onload = function() {

    let handleAddTaskIMG = function(event) {
        app.addTask();
    }
    let button = document.querySelector("#button");
    button.addEventListener("dblclick", handleAddTaskIMG);

    let handleAddTaskParagraph = function(event) {
        app.addTask();
    }
    let addParagraph = this.document.querySelector("#buttonText");
    addParagraph.addEventListener("click", handleAddTaskParagraph);

    let tasksArr = JSON.parse(localStorage.getItem("task"));

    if(tasksArr === null) {
        tasksArr = localStorage.setItem("task", JSON.stringify(new Array()));
    }
    let app = new App(tasksArr);
    app.renderTasks();
}