import "@vaadin/vaadin-button";
import { LitElement, html, customElement } from "lit-element";
import { showNotification } from "./util";

//@ts-ignore
const vscode = acquireVsCodeApi();

@customElement("main-view")
export class MainView extends LitElement {
  render() {
    return html`
      <vaadin-button @click="${() => this.hello()}">hello</vaadin-button>
      <vaadin-notification><template>Hello</template></vaadin-notification>
    `;
  }
  hello() {
    debugger;
    showNotification("foobar");
  }
}

console.log("Hello", vscode);
