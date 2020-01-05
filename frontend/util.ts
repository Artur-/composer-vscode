import "@vaadin/vaadin-notification";

const showNotification = (text: string) => {
  const n = _showNotification(text);
  n.position = "middle";
};
const showErrorNotification = (text: string) => {
  const n = _showNotification(text);
  n.setAttribute("theme", "error");
  n.position = "middle";
  n.duration = -1;
};
const _showNotification = (text: string) => {
  const n: any = document.createElement("vaadin-notification");
  const tpl = document.createElement("template");
  const span = document.createElement("span");
  span.innerText = text;
  tpl.content.appendChild(span);
  n.appendChild(tpl);
  document.body.appendChild(n);
  n.opened = true;
  n.addEventListener("opened-changed", (e: any) => {
    if (!e.detail.opened) {
      document.body.removeChild(n);
    }
  });
  n._container.addEventListener("click", () => {
    n.opened = false;
  });
  return n;
};

export { showErrorNotification, showNotification };
