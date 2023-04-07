import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";

const fs = require('fs');
const path = require('path');
import * as vscode from "vscode";

import { TaskItem } from "../types/Tasks";

export class TasksPanel {
  public static currentPanel: TasksPanel | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];

  public tasks: TaskItem[] = [];
  public tasksFilePath: string | undefined;

  private constructor(panel: WebviewPanel, extensionUri: Uri) {
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
    } else {
      this.tasks = [];
    }

    // vscode.workspace.getConfiguration().update('vscode-task-manager.tasks', this.tasks, vscode.ConfigurationTarget.Global);
    console.log('0');

    this._panel.webview.postMessage({ command: 'init', tasks: this.tasks });

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview);
  }

  public updateWebviewTasks()
  {
    this._panel.webview.postMessage({ command: 'update', tasks: this.tasks });
  }

  public static render(extensionUri: Uri) {
    if (TasksPanel.currentPanel) {
      // If the webview panel already exists reveal it
      TasksPanel.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = window.createWebviewPanel(
        // Panel view type
        "showHelloWorld",
        // Panel title
        "Task manager",
        // The editor column the panel should be displayed in
        ViewColumn.One,
        // Extra panel configurations
        {
          // Enable JavaScript in the webview
          enableScripts: true,
          // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
          localResourceRoots: [Uri.joinPath(extensionUri, "out"), Uri.joinPath(extensionUri, "webview-ui/build")],
        }
      );

      TasksPanel.currentPanel = new TasksPanel(panel, extensionUri);
    }
  }

  public dispose() {
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

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    // The CSS file from the Vue build output
    const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
    // The JS file from the Vue build output
    const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);

    const nonce = getNonce();

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

  private generateID() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;

        switch (command) {
          case "hello":
            // Code that should run in response to the hello message command
            window.showInformationMessage("hello");
            return;
          // Add more switch case statements here as more webview message commands
          // are created within the webview context (i.e. inside media/main.js)
          case 'updateTasks':
            this.tasks.splice(0, this.tasks.length, ...message.tasks);
            // this.updateWebviewTasks();
            break;
          case 'deleteTask':
            var index = this.tasks.findIndex((o: TaskItem) => o.id == message.id)
            this.tasks.splice(index, 1);
            // this.updateWebviewTasks();
            break;
          case 'createTask':
            var item = new TaskItem();
            item.id = this.generateID();
            item.status = "undone";
            this.tasks.push(item);
            // this.updateWebviewTasks();
            break;
        }
        fs.writeFileSync(this.tasksFilePath, JSON.stringify(this.tasks));
      },
      undefined,
      this._disposables
    );
  }
}
