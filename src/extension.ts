import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "tspmovro" is now active!');

    let disposable = vscode.commands.registerCommand('tspmovro.printText', async () => {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found. Please open a .pmo file.');
            return;
        }
        
        const filePath = editor.document.uri.fsPath;
        
        // Check if the file has .pmo extension
        if (!filePath.toLowerCase().endsWith('.pmo')) {
            vscode.window.showErrorMessage('The active file is not a .pmo file.');
            return;
        }
        
        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            vscode.window.showErrorMessage(`File not found: ${filePath}`);
            return;
        }
        
        // Copy the compiler.py to a temporary location to ensure it's accessible
        const tempDir = path.join(context.extensionPath, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        
        const sourceCompilerPath = path.join(context.extensionPath, 'compiler.py');
        const tempCompilerPath = path.join(tempDir, 'compiler.py');
        
        // Copy the compiler.py to the temp directory
        fs.copyFileSync(sourceCompilerPath, tempCompilerPath);
        
        // Run the Python script with the .pmo file as an argument
        const command = `python "${tempCompilerPath}" "${filePath}"`;
        
        try {
            // Execute the command
            child_process.exec(command, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Error: ${error.message}`);
                    return;
                }
                
                if (stderr) {
                    vscode.window.showErrorMessage(`Error: ${stderr}`);
                    return;
                }
                
                // Display the Python script output
                vscode.window.showInformationMessage(stdout);
            });
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to execute command: ${err}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
