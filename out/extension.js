"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode_1 = require("vscode");
const TasksPanel_1 = require("./panels/TasksPanel");
function activate(context) {
    // Create the show hello world command
    const showHelloWorldCommand = vscode_1.commands.registerCommand("hello-world.showHelloWorld", () => {
        TasksPanel_1.TasksPanel.render(context.extensionUri);
    });
    // Add command to the extension context
    context.subscriptions.push(showHelloWorldCommand);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map