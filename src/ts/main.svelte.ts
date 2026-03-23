import { mount } from "svelte"
import App from "../svelte/App.svelte"
import "../css/block.css";
import "../css/main.css";
import "../css/popup.css";
import "../css/topbar.css";
import { HuopaBlocksRuntime } from "../ts/runtime";
import { type ProjectHeader, Type, NodeType, Shape, type Theme } from "./types";

export const CurrentTheme: Theme = $state({
  dark: localStorage.getItem("HuopaBlocksDarkMode") === "true"
});

export function initTheme() {
  $effect(() => {
    localStorage.setItem("HuopaBlocksDarkMode", JSON.stringify(CurrentTheme.dark));
    document.body.classList.toggle("Dark", CurrentTheme.dark);
    document.body.classList.toggle("Light", !CurrentTheme.dark);
  });
}

export const project: ProjectHeader = $state({
  "name": "Test Project",
  "description": "Description yay",
  "variables": {
    "MyVariable": {
      "value": "0",
      "type": 1
    }
  },
  "blocks": [
    {
      "x": 634.98,
      "y": 82.31,
      "id": "8J5dwCDT5lBBb4H3px77D",
      "children": [
        {
          "id": "wYmQ1XYcPhwvf4g-JFMwF",
          "nodeType": 2,
          "op": "EVENTS_PROJECT_START",
          "shape": 1,
          "category": "EVENTS",
          "children": []
        },
        {
          "id": "R29UqMPWqI05W2gNfmOfb",
          "nodeType": 2,
          "op": "DEBUG_LOG",
          "shape": 0,
          "category": "DEBUG",
          "children": [
            {
              "value": "Hello",
              "nodeType": 1,
              "type": 0
            }
          ]
        },
        {
          "id": "l91WqaXrvmFR1Ix-2NOnO",
          "nodeType": 2,
          "op": "CONTROL_WAIT",
          "shape": 0,
          "category": "CONTROL",
          "children": [
            {
              "value": "3",
              "nodeType": 1,
              "type": 1
            }
          ]
        },
        {
          "id": "4DkGMq1SVJNrLW72i2AEP",
          "nodeType": 2,
          "op": "DEBUG_LOG",
          "shape": 0,
          "category": "DEBUG",
          "children": [
            {
              "id": "uoVtMYoBibJf60QI9tWfd",
              "nodeType": 2,
              "op": "OPERATORS_ADD",
              "shape": 4,
              "category": "OPERATORS",
              "children": [
                {
                  "value": "1",
                  "nodeType": 1,
                  "type": 1
                },
                {
                  "value": "2",
                  "nodeType": 1,
                  "type": 1
                }
              ]
            }
          ]
        },
        {
          "id": "ARiD3evndIzlUTTMvXtU_",
          "nodeType": 2,
          "op": "CONTROL_STOP_ALL",
          "shape": 2,
          "category": "CONTROL",
          "children": []
        }
      ]
    }
  ]
});

export const runtime = new HuopaBlocksRuntime(project.variables);

const app = mount(App, {
  target: document.getElementById("main")!,
})

export default app
