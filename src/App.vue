<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
interface Todo {
  description: string;
  id: number;
  completed: boolean;
}

const todos: Ref<Todo[]> = ref([]);
const todo: Ref<string> = ref("");
const loading: Ref<boolean> = ref(true);
const todosBeingEdited: Ref<number[]> = ref([]);

function saveTodosIntoLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos.value));
}

function fetchTodos(): Todo[] {
  const todosJSON = localStorage.getItem("todos");
  if (todosJSON === null) return [];

  return JSON.parse(todosJSON);
}

function deleteTodo(id: number) {
  const cTodos = JSON.parse(JSON.stringify(todos.value));
  const newTodos = cTodos.filter((t: Todo) => {
    return t.id !== id;
  });
  todos.value = newTodos;
  saveTodosIntoLocalStorage();
}

function addTodo() {
  loading.value = true;
  if (todo.value !== "") {
    const newTodo = {
      id: todos.value.length + 1,
      description: todo.value,
      completed: false,
    };
    todos.value.push(newTodo);
    saveTodosIntoLocalStorage();
    todo.value = "";
    loading.value = false;
  }
}

function updateTodo() {
  saveTodosIntoLocalStorage();
}

function editTodo(id: number) {
  todosBeingEdited.value.push(id);
}

function saveEditedTodos() {
  saveTodosIntoLocalStorage();
  todosBeingEdited.value = [];
}

onMounted(() => {
  loading.value = true;
  let id = setTimeout(() => {
    todos.value = fetchTodos();
    loading.value = false;
    clearTimeout(id);
  }, 1500);
});
</script>

<template>
  <div class="container">
    <h1 data-testid="title">Todos</h1>
    <div v-if="loading">Loading...</div>
    <ul v-else class="todos-list">
      <li v-for="todo in todos" :key="todo.id" data-testid="todo-item">
        <input
          type="checkbox"
          v-model="todo.completed"
          @change="updateTodo"
          data-testid="complete-todo-input"
        />
        <h4>
          <input
            v-if="todosBeingEdited.includes(todo.id)"
            type="text"
            v-model="todo.description"
            data-testid="edit-todo-input"
          />
          <span v-else class="todo-description">
            {{ todo.description }}
          </span>
        </h4>
        <button @click="deleteTodo(todo.id)" data-testid="delete-todo-button">
          delete
        </button>
        <button
          @click="editTodo(todo.id)"
          :disabled="todosBeingEdited.includes(todo.id)"
          data-testid="edit-todo-button"
        >
          edit
        </button>
      </li>
      <button
        v-if="todosBeingEdited.length > 0"
        @click="saveEditedTodos"
        data-testid="save-todo-button"
      >
        save
      </button>
    </ul>
    <div id="todoBar">
      <input v-model="todo" type="text" data-testid="create-todo-input" />
      <button @click="addTodo()" data-testid="create-todo-button">create todo</button>
    </div>
  </div>
</template>

<style>
.container,
ul {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* align-self: stretch; */
}

.container ul {
  max-width: calc(768px - 32px);
  margin: 40px 0px;
}

.todos-list li {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: 1px solid gray;
}

.todos-list h4 {
  flex: 1;
}

.todos-list .todo-description {
  padding: 20px 40px;
}

#todoBar input {
  width: 280px;
  height: 32px;
  padding: 10px;
  margin-right: 20px;
}
</style>
