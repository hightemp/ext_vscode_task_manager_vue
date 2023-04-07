<script setup lang="ts">
import { 
  provideVSCodeDesignSystem, 
  vsCodeButton, 
  vsCodeCheckbox, 
  vsCodeTextField,
  vsCodeDropdown,
  vsCodeOption
} from "@vscode/webview-ui-toolkit";
import { vscode } from "./utilities/vscode";
import { TaskItem } from "../../src/types/Tasks";

var tasks: TaskItem[] = [];

window.addEventListener('message', event => {
  if (event.data.type === 'update') {
    tasks = event.data.tasks
    console.log(tasks)
  }
});

console.log(tasks)

// In order to use the Webview UI Toolkit web components they
// must be registered with the browser (i.e. webview) using the
// syntax below.
provideVSCodeDesignSystem().register(vsCodeButton());
provideVSCodeDesignSystem().register(vsCodeTextField());
provideVSCodeDesignSystem().register(vsCodeDropdown());
provideVSCodeDesignSystem().register(vsCodeOption());

// To register more toolkit components, simply import the component
// registration function and call it from within the register
// function, like so:
//
// provideVSCodeDesignSystem().register(
//   vsCodeButton(),
//   vsCodeCheckbox()
// );
//
// Finally, if you would like to register all of the toolkit
// components at once, there's a handy convenience function:
//
// provideVSCodeDesignSystem().register(allComponents);

function handleAddTaskClick() {
  vscode.postMessage({
    command: "createTask",
  });
}

function handleStatusChangeClick(id: string, event: any) {
  console.log(event)
  // var index = tasks.findIndex((o: TaskItem) => o.id == id)
  // tasks.splice(index, 1, );
  vscode.postMessage({
    command: "updateTasks",
    tasks
  });
}

function handleTitleChangeClick(id: string, event: any) {
  console.log(event)
  vscode.postMessage({
    command: "updateTasks",
    tasks
  });
}

function handleDeleteClick(id: string, event: any) {
  vscode.postMessage({
    command: "deleteTask",
    id
  });
}
</script>

<template>
  <main>
    <vscode-button @click="handleAddTaskClick">Сохранить</vscode-button>
    <table class="table table-striped">
      <tr>
        <td></td>
        <td>Заголовок задачи</td>
        <td></td>
      </tr>
      <tr v-for="task in tasks">
        <td>
          <vs-code-dropdown 
            v-model="task.status"
            @change="handleStatusChangeClick(task.id, $event)"
          >
            <vs-code-option></vs-code-option>
          </vs-code-dropdown>
        </td>
        <td>
          <vs-code-text-field 
            v-model="task.title"
            @change="handleTitleChangeClick(task.id, $event)"
          ></vs-code-text-field>
        </td>
        <td>
          <vscode-button @click="handleDeleteClick(task.id, $event)">Удалить</vscode-button>
        </td>
      </tr>
    </table>
    
  </main>
</template>

<style>
:root {
    --bs-blue: #0d6efd;
    --bs-indigo: #6610f2;
    --bs-purple: #6f42c1;
    --bs-pink: #d63384;
    --bs-red: #dc3545;
    --bs-orange: #fd7e14;
    --bs-yellow: #ffc107;
    --bs-green: #198754;
    --bs-teal: #20c997;
    --bs-cyan: #0dcaf0;
    --bs-black: #000;
    --bs-white: #fff;
    --bs-gray: #6c757d;
    --bs-gray-dark: #343a40;
    --bs-gray-100: #f8f9fa;
    --bs-gray-200: #e9ecef;
    --bs-gray-300: #dee2e6;
    --bs-gray-400: #ced4da;
    --bs-gray-500: #adb5bd;
    --bs-gray-600: #6c757d;
    --bs-gray-700: #495057;
    --bs-gray-800: #343a40;
    --bs-gray-900: #212529;
    --bs-primary: #0d6efd;
    --bs-secondary: #6c757d;
    --bs-success: #198754;
    --bs-info: #0dcaf0;
    --bs-warning: #ffc107;
    --bs-danger: #dc3545;
    --bs-light: #f8f9fa;
    --bs-dark: #212529;
    --bs-primary-rgb: 13,110,253;
    --bs-secondary-rgb: 108,117,125;
    --bs-success-rgb: 25,135,84;
    --bs-info-rgb: 13,202,240;
    --bs-warning-rgb: 255,193,7;
    --bs-danger-rgb: 220,53,69;
    --bs-light-rgb: 248,249,250;
    --bs-dark-rgb: 33,37,41;
    --bs-primary-text-emphasis: #052c65;
    --bs-secondary-text-emphasis: #2b2f32;
    --bs-success-text-emphasis: #0a3622;
    --bs-info-text-emphasis: #055160;
    --bs-warning-text-emphasis: #664d03;
    --bs-danger-text-emphasis: #58151c;
    --bs-light-text-emphasis: #495057;
    --bs-dark-text-emphasis: #495057;
    --bs-primary-bg-subtle: #cfe2ff;
    --bs-secondary-bg-subtle: #e2e3e5;
    --bs-success-bg-subtle: #d1e7dd;
    --bs-info-bg-subtle: #cff4fc;
    --bs-warning-bg-subtle: #fff3cd;
    --bs-danger-bg-subtle: #f8d7da;
    --bs-light-bg-subtle: #fcfcfd;
    --bs-dark-bg-subtle: #ced4da;
    --bs-primary-border-subtle: #9ec5fe;
    --bs-secondary-border-subtle: #c4c8cb;
    --bs-success-border-subtle: #a3cfbb;
    --bs-info-border-subtle: #9eeaf9;
    --bs-warning-border-subtle: #ffe69c;
    --bs-danger-border-subtle: #f1aeb5;
    --bs-light-border-subtle: #e9ecef;
    --bs-dark-border-subtle: #adb5bd;
    --bs-white-rgb: 255,255,255;
    --bs-black-rgb: 0,0,0;
    --bs-font-sans-serif: system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    --bs-font-monospace: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
    --bs-gradient: linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
    --bs-body-font-family: var(--bs-font-sans-serif);
    --bs-body-font-size: 1rem;
    --bs-body-font-weight: 400;
    --bs-body-line-height: 1.5;
    --bs-body-color: #212529;
    --bs-body-color-rgb: 33,37,41;
    --bs-body-bg: #fff;
    --bs-body-bg-rgb: 255,255,255;
    --bs-emphasis-color: #000;
    --bs-emphasis-color-rgb: 0,0,0;
    --bs-secondary-color: rgba(33, 37, 41, 0.75);
    --bs-secondary-color-rgb: 33,37,41;
    --bs-secondary-bg: #e9ecef;
    --bs-secondary-bg-rgb: 233,236,239;
    --bs-tertiary-color: rgba(33, 37, 41, 0.5);
    --bs-tertiary-color-rgb: 33,37,41;
    --bs-tertiary-bg: #f8f9fa;
    --bs-tertiary-bg-rgb: 248,249,250;
    --bs-link-color: #0d6efd;
    --bs-link-color-rgb: 13,110,253;
    --bs-link-decoration: underline;
    --bs-link-hover-color: #0a58ca;
    --bs-link-hover-color-rgb: 10,88,202;
    --bs-code-color: #d63384;
    --bs-highlight-bg: #fff3cd;
    --bs-border-width: 1px;
    --bs-border-style: solid;
    --bs-border-color: #dee2e6;
    --bs-border-color-translucent: rgba(0, 0, 0, 0.175);
    --bs-border-radius: 0.375rem;
    --bs-border-radius-sm: 0.25rem;
    --bs-border-radius-lg: 0.5rem;
    --bs-border-radius-xl: 1rem;
    --bs-border-radius-xxl: 2rem;
    --bs-border-radius-2xl: var(--bs-border-radius-xxl);
    --bs-border-radius-pill: 50rem;
    --bs-box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    --bs-box-shadow-sm: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    --bs-box-shadow-lg: 0 1rem 3rem rgba(0, 0, 0, 0.175);
    --bs-box-shadow-inset: inset 0 1px 2px rgba(0, 0, 0, 0.075);
    --bs-focus-ring-width: 0.25rem;
    --bs-focus-ring-opacity: 0.25;
    --bs-focus-ring-color: rgba(13, 110, 253, 0.25);
    --bs-form-valid-color: #198754;
    --bs-form-valid-border-color: #198754;
    --bs-form-invalid-color: #dc3545;
    --bs-form-invalid-border-color: #dc3545;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
}

main > * {
  margin: 1rem 0;
}

main {
  font-family: Arial, Helvetica, sans-serif;
}

.table {
    --bs-table-color: var(--bs-body-color);
    --bs-table-bg: transparent;
    --bs-table-border-color: var(--bs-border-color);
    --bs-table-accent-bg: transparent;
    --bs-table-striped-color: var(--bs-body-color);
    --bs-table-striped-bg: rgba(0, 0, 0, 0.05);
    --bs-table-active-color: var(--bs-body-color);
    --bs-table-active-bg: rgba(0, 0, 0, 0.1);
    --bs-table-hover-color: var(--bs-body-color);
    --bs-table-hover-bg: rgba(0, 0, 0, 0.075);
    width: 100%;
    margin-bottom: 1rem;
    color: var(--bs-table-color);
    vertical-align: top;
    border-color: var(--bs-table-border-color);
}
table {
    caption-side: bottom;
    border-collapse: collapse;
}
</style>
