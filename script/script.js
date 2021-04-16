'use strict';

const todoControl = document.querySelector('.todo-control'),
      headerInput = document.querySelector('.header-input'),
      todoList = document.querySelector('.todo-list'),
      todoCompleted = document.querySelector('.todo-completed');

let todoData = [];
  
const render = function () { 
    todoList.textContent = '';
    todoCompleted.textContent = '';
    
  todoData.forEach(function(item){

        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.setAttribute('data-key', item.id);
        li.innerHTML = '<span class="text-todo">' + item.value + '</span>' +
          '<div class="todo-buttons">' +
            '<button class="todo-remove"></button>' +
            '<button class="todo-complete"></button>' +
          '</div>';

          if (item.completed){
            todoCompleted.append(li);
          } else {
            todoList.append(li);
          }

          const btnTodoComplete = li.querySelector('.todo-complete');

          btnTodoComplete.addEventListener('click', function(){
            item.completed = !item.completed;
            addToLocalStorage(todoData);
            render();
          });

          const btnTodoDelete = li.querySelector('.todo-remove');

          btnTodoDelete.addEventListener('click', function(){
            deleteTodo(li.getAttribute('data-key'));
          });
          
    });
 };

 todoControl.addEventListener('submit', function(event){
    event.preventDefault();

    let newTodo = {
      id: Date.now(),
      value: headerInput.value,
      completed: false  
    };
    
    if (headerInput.value == ''){
      
    } else {
      todoData.push(newTodo);
      addToLocalStorage(todoData);
      headerInput.value = '';
    }
    render();
 });
function addToLocalStorage(todoData) {
  localStorage.setItem('todoData', JSON.stringify(todoData));
  render(todoData);
}

function getFromLocalStorage() {
  const reference = localStorage.getItem('todoData');
  if (reference) {
    todoData = JSON.parse(reference);
    render(todoData);
  }
}
getFromLocalStorage();

function deleteTodo(id) {
  todoData = todoData.filter(function(item) {
    return item.id != id;
  });
  addToLocalStorage(todoData);
}

 render();