"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@vaadin/vaadin-button");
const lit_element_1 = require("lit-element");
const util_1 = require("./util");
//@ts-ignore
const vscode = acquireVsCodeApi();
let MainView = class MainView extends lit_element_1.LitElement {
    render() {
        return lit_element_1.html `
      <vaadin-button @click="${() => this.hello()}">hello</vaadin-button>
      <vaadin-notification><template>Hello</template></vaadin-notification>
    `;
    }
    hello() {
        debugger;
        util_1.showNotification("foobar");
    }
};
MainView = __decorate([
    lit_element_1.customElement("main-view")
], MainView);
exports.MainView = MainView;
console.log("Hello", vscode);
//# sourceMappingURL=main-view.js.map