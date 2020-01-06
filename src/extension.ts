import * as path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("composer.start", () => {
      ComposerPanel.createOrShow(context.extensionPath);
    })
  );

  if (vscode.window.registerWebviewPanelSerializer) {
    // Make sure we register a serializer in activation event
    vscode.window.registerWebviewPanelSerializer(ComposerPanel.viewType, {
      async deserializeWebviewPanel(
        webviewPanel: vscode.WebviewPanel,
        state: any
      ) {
        console.log(`Got state: ${state}`);
        ComposerPanel.revive(webviewPanel, context.extensionPath);
      }
    });
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}

class ComposerPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: ComposerPanel | undefined;

  public static readonly viewType = "vaadinComposer";
  private _disposables: vscode.Disposable[] = [];
  private readonly _extensionPath: string;
  private readonly _panel: vscode.WebviewPanel;

  public static createOrShow(extensionPath: string) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;
    // If we already have a panel, show it.
    if (ComposerPanel.currentPanel) {
      ComposerPanel.currentPanel._panel.reveal(column);
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      ComposerPanel.viewType,
      "Cat Coding",
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `editor` directory.
        localResourceRoots: [vscode.Uri.file(path.join(extensionPath, "build"))]
      }
    );

    ComposerPanel.currentPanel = new ComposerPanel(panel, extensionPath);
  }

  public static revive(panel: vscode.WebviewPanel, extensionPath: string) {
    ComposerPanel.currentPanel = new ComposerPanel(panel, extensionPath);
  }

  private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
    this._panel = panel;
    this._extensionPath = extensionPath;

    // Set the webview's initial html content
    this._update();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Update the content based on view changes
    this._panel.onDidChangeViewState(
      () => {
        if (this._panel.visible) {
          this._update();
        }
      },
      null,
      this._disposables
    );

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "alert":
            vscode.window.showErrorMessage(message.text);
            return;
        }
      },
      null,
      this._disposables
    );
  }

  public dispose() {
    ComposerPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
  private _update() {
    const webview = this._panel.webview;

    // Vary the webview's content based on where it is located in the editor.
    switch (this._panel.viewColumn) {
      case vscode.ViewColumn.Two:
        this._updateForCat(webview, "Compiling Cat");
        return;

      case vscode.ViewColumn.Three:
        this._updateForCat(webview, "Testing Cat");
        return;

      case vscode.ViewColumn.One:
      default:
        this._updateForCat(webview, "my-view.ts (Composer)");
        return;
    }
  }
  private _updateForCat(webview: vscode.Webview, catName: string) {
    this._panel.title = catName;
    this._panel.webview.html = this._getHtmlForWebview(webview, catName);
  }
  private _getHtmlForWebview(webview: vscode.Webview, _catName: string) {
    // Local path to main script run in the webview
    const scriptPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, "build", "main.js")
    );

    // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<!--
			Use a content security policy to only allow loading images from https or from our extension directory,
			and only allow scripts that have a specific nonce.
			-->
<!--			<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">-->
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Vaadin Composer</title>
			<script type="module" nonce="${nonce}" src="${scriptUri}"></script>
		</head>
		<body>
			<main-view></main-view>
		</body>
		</html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
