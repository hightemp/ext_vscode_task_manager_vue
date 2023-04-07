"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksPanel = void 0;
const vscode_1 = require("vscode");
const getUri_1 = require("../utilities/getUri");
const getNonce_1 = require("../utilities/getNonce");
const fs = require('fs');
const path = require('path');
const Tasks_1 = require("../types/Tasks");
class TasksPanel {
    constructor(panel, extensionUri) {
        this._disposables = [];
        this.tasks = [];
        this._panel = panel;
        const dataFolderPath = process.platform === 'win32'
            ? path.join(process.env.USERPROFILE, 'vscode-task-manager')
            : path.join(process.env.HOME, '.vscode-task-manager');
        const dataFilePath = path.join(dataFolderPath, 'data.json');
        if (!fs.existsSync(dataFolderPath)) {
            fs.mkdirSync(dataFolderPath);
        }
        this.tasksFilePath = dataFilePath;
        if (fs.existsSync(this.tasksFilePath)) {
            this.tasks = JSON.parse(fs.readFileSync(this.tasksFilePath));
        }
        else {
            this.tasks = [];
        }
        this.updateWebviewTasks();
        // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
        // the panel or when the panel is closed programmatically)
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Set the HTML content for the webview panel
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener(this._panel.webview);
    }
    updateWebviewTasks() {
        this._panel.webview.postMessage({ type: 'update', tasks: this.tasks });
    }
    static render(extensionUri) {
        if (TasksPanel.currentPanel) {
            // If the webview panel already exists reveal it
            TasksPanel.currentPanel._panel.reveal(vscode_1.ViewColumn.One);
        }
        else {
            // If a webview panel does not already exist create and show a new one
            const panel = vscode_1.window.createWebviewPanel(
            // Panel view type
            "showHelloWorld", 
            // Panel title
            "Task manager", 
            // The editor column the panel should be displayed in
            vscode_1.ViewColumn.One, 
            // Extra panel configurations
            {
                // Enable JavaScript in the webview
                enableScripts: true,
                // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
                localResourceRoots: [vscode_1.Uri.joinPath(extensionUri, "out"), vscode_1.Uri.joinPath(extensionUri, "webview-ui/build")],
            });
            TasksPanel.currentPanel = new TasksPanel(panel, extensionUri);
        }
    }
    dispose() {
        TasksPanel.currentPanel = undefined;
        fs.writeFileSync(this.tasksFilePath, JSON.stringify(this.tasks));
        // Dispose of the current webview panel
        this._panel.dispose();
        // Dispose of all disposables (i.e. commands) for the current webview panel
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
    _getWebviewContent(webview, extensionUri) {
        // The CSS file from the Vue build output
        const stylesUri = (0, getUri_1.getUri)(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
        // The JS file from the Vue build output
        const scriptUri = (0, getUri_1.getUri)(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);
        const nonce = (0, getNonce_1.getNonce)();
        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
        return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Task manager</title>
        </head>
        <body>
          <div id="app"></div>
          <script>
            window.tasks = ${JSON.stringify(this.tasks)}; // передаем список задач в компонент
          </script>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
    }
    generateID() {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    _setWebviewMessageListener(webview) {
        webview.onDidReceiveMessage((message) => {
            const command = message.command;
            switch (command) {
                case "hello":
                    // Code that should run in response to the hello message command
                    vscode_1.window.showInformationMessage("hello");
                    return;
                // Add more switch case statements here as more webview message commands
                // are created within the webview context (i.e. inside media/main.js)
                case 'updateTasks':
                    this.tasks.splice(0, this.tasks.length, ...message.tasks);
                    this.updateWebviewTasks();
                    break;
                case 'deleteTask':
                    var index = this.tasks.findIndex((o) => o.id == message.id);
                    this.tasks.splice(index, 1);
                    this.updateWebviewTasks();
                    break;
                case 'createTask':
                    var item = new Tasks_1.TaskItem();
                    item.id = this.generateID();
                    this.tasks.push(item);
                    this.updateWebviewTasks();
                    break;
            }
            fs.writeFileSync(this.tasksFilePath, JSON.stringify(this.tasks));
        }, undefined, this._disposables);
    }
}
exports.TasksPanel = TasksPanel;
//# sourceMappingURL=TasksPanel.js.map