import { mediator } from "../bus/mediator";

function stringBoolean(input) {
  return input ? "true" : "false";
}

function togglePressed() {
  let pressedState = this.getAttribute("aria-pressed");
  document.body.classList.toggle(this.dataset.toggle);
  this.setAttribute("aria-pressed", stringBoolean(pressedState !== "true"));
  mediator.publish(this.dataset.toggle, pressedState === "true" ? "off" : "on");
}

export function initToggle() {
  const toggles = document.querySelectorAll(".button-toggle");
  Array.from(toggles).forEach((el) => {
    el.addEventListener("click", togglePressed);
  });
}
