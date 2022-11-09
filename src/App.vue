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
  <div>
    <h1>Todos</h1>
    <div v-if="loading">Loading...</div>
    <ul v-else class="todos-list">
      <li v-for="todo in todos" :key="todo.id">
        <input type="checkbox" v-model="todo.completed" @change="updateTodo" />
        <h4>{{ todo.description }}</h4>
        <button @click="deleteTodo(todo.id)">delete</button>
      </li>
    </ul>
    <div id="input">
      <input v-model="todo" type="text" />
      <button @click="addTodo()">create todo</button>
    </div>
  </div>
</template>
