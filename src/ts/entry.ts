import { mount } from "svelte";
import App from "../svelte/App.svelte";
import "../css/block.css";
import "../css/main.css";
import "../css/popup.css";
import "../css/topbar.css";

const app = mount(App, {
  target: document.getElementById("main")!,
});

export default app;