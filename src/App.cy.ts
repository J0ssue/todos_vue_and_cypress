import App from "./App.vue";
const create_todo_input = '[data-testid="create-todo-input"]';
const create_todo_button = '[data-testid="create-todo-button"]';
const todo_item = '[data-testid="todo-item"]';
const delete_todo_button = '[data-testid="delete-todo-button"]';
const complete_todo_input = '[data-testid="complete-todo-input"]';
const edit_todo_button = '[data-testid="edit-todo-button"]';
const edit_todo_input = '[data-testid="edit-todo-input"]';
const save_todo_button = '[data-testid="save-todo-button"]';

describe("<App />", () => {
  function runInit() {
    // see: https://test-utils.vuejs.org/guide/
    cy.mount(App);
    cy.clearLocalStorage(); // clear all local storage
  }

  function addTodo(todo: string) {
    cy.get(create_todo_input).type(todo);
    cy.get(create_todo_button).click();
  }

  it("renders", () => {
    runInit();
    const TITLE = "Todos";

    cy.get('[data-testid="title"]').then(($h1) => {
      const title = $h1.text();
      expect(title).to.eq(TITLE);
    });
  });

  it("adds new todo", () => {
    runInit();
    addTodo("hello world");
    cy.get(todo_item).then(($li) => {
      expect(JSON.stringify($li.text().includes("hello world"))).to.eq("true");
    });
  });

  it("deletes todo", () => {
    runInit();
    addTodo("delete this todo");
    cy.get(delete_todo_button).click();
    cy.get(todo_item).should("not.exist");
  });

  it("completes todo", () => {
    runInit();
    addTodo("complete this todo");
    cy.get(complete_todo_input).check();
    cy.get(complete_todo_input).should("be.checked").and("have.value", "on");
  });

  it("edit todo", () => {
    runInit();
    addTodo("new todo");
    cy.get(edit_todo_button).click();
    cy.get(edit_todo_input).clear();
    cy.get(edit_todo_input).type("Edit this todo");
    cy.wait(200);
    cy.get(save_todo_button).click();
    cy.wait(200);
    cy.get(todo_item).should("include.text", "Edit this todo");
  });
});
