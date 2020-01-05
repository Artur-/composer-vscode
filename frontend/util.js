"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@vaadin/vaadin-notification");
const showNotification = (text) => {
    const n = _showNotification(text);
    n.position = "middle";
};
exports.showNotification = showNotification;
const showErrorNotification = (text) => {
    const n = _showNotification(text);
    n.setAttribute("theme", "error");
    n.position = "middle";
    n.duration = -1;
};
exports.showErrorNotification = showErrorNotification;
const _showNotification = (text) => {
    const n = document.createElement("vaadin-notification");
    const tpl = document.createElement("template");
    const span = document.createElement("span");
    span.innerText = text;
    tpl.content.appendChild(span);
    n.appendChild(tpl);
    document.body.appendChild(n);
    n.opened = true;
    n.addEventListener("opened-changed", (e) => {
        if (!e.detail.opened) {
            document.body.removeChild(n);
        }
    });
    n._container.addEventListener("click", () => {
        n.opened = false;
    });
    return n;
};
//# sourceMappingURL=util.js.map