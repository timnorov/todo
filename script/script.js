'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
        this.todoContainer = document.querySelector('.todo-container');
        this.item;
    }

    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    createItem(todo) {

        const li = document.createElement('li');

        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
      <span class="text-todo">${todo.value}</span>
				<div class="todo-buttons">
                    <button class="todo-edit"></button>
					<button class="todo-remove"></button>
					<button class="todo-complete"></button>
				</div>
    `);

        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    addTodo(e) {
        e.preventDefault();

        if (this.input.value === '') {
            alert('Поле "Какие планы?" не заполнено');
        }  else if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
            this.input.value = '';
            this.render();
        }
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    deleteItem() {
        this.todoData.delete(this.item.key);
        this.render();


    }

    completedItem() {
        setTimeout(() => {
            const arr = this.todoData.get(this.item.key);
            for (const key in arr) {
                if (key === 'completed') {
                    if (arr[key] === false) {
                        arr[key] = true;
                    } else
                        arr[key] = false;
                }
            }
            this.render();
        }, 300);
    }

    editItem() {
        const arr = this.todoData.get(this.item.key);
        const text = this.item.querySelector('.text-todo');
        this.item.querySelector('.text-todo').setAttribute('contenteditable', true);
        this.item.querySelector('.text-todo').style.backgroundColor = '#f0f08aa6';
        this.item.querySelector('.text-todo').focus();
        this.item.addEventListener('click', event => {
            event.preventDefault();

            const target = event.target;
            if (target.matches('.text-todo, .todo-item')) {
                return;
            } else if (target.matches('.todo-save')) {
                text.removeAttribute('contenteditable');
                text.style.removeProperty('background-color');
                this.item.querySelector('.todo-save').remove();

                for (const key in arr) {
                    if (key === 'value') {
                        arr[key] = text.textContent;
                    }
                }
            }
            this.render();
        });
    }

    handler() {
        this.todoContainer.addEventListener('click', event => {
            event.preventDefault();

            const target = event.target;
            if (target.matches('.todo-complete')) {
                this.item = target.closest('li');
                this.fadeOut(this.item, 300);
                this.completedItem();
            } else if (target.matches('.todo-remove')) {
                this.item = target.closest('li');
                this.animate({
                    duration: 500,
                    timing(timeFraction) {
                        return timeFraction;
                    },
                    draw(progress) {
                        target.closest('li').style.left = progress * -4000 + 'px';
                    }
                    });
                    setTimeout(() => {
                        this.deleteItem();
                    }, 1000);    
            } else if (target.matches('.todo-edit')) {
                this.item = target.closest('li');
                this.item.querySelector('.todo-edit').insertAdjacentHTML('beforebegin', `
                    <button class="todo-save"></button>`);
                this.item.querySelector('.todo-save').style.backgroundImage = "url(../img/save.png)";
                this.item.querySelector('.todo-edit').style.display = 'none';
                this.editItem();
            }
        });

    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.handler();
        this.render();
    }

    fadeOut(node, duration) {
        node.style.opacity = 1;

        const start = performance.now();

        requestAnimationFrame(function tick(timestamp) {
            const easing = (timestamp - start) / duration;
            node.style.opacity = Math.max(1 - easing, 0);

            if (easing < 1) {
                requestAnimationFrame(tick);
            } else {
                node.style.opacity = '';
                node.style.display = 'none';
            }
        });
    }
    animate({timing, draw, duration}) {

        let start = performance.now();

        requestAnimationFrame(function animate(time) {
            // timeFraction goes from 0 to 1
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            let x = 1.5;
            function back(x, timeFraction) {
            return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x)
            }                
            // calculate the current animation state
            let progress = back(x, timeFraction);

            draw(progress); // draw it

            if (timeFraction < 1) {
            requestAnimationFrame(animate);
            }

        });
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
