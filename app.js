import { Render } from "./ui/Render.js";

window.game = {
  render: Render
};

window.addEventListener("DOMContentLoaded", () => {
  Render.init();
});
