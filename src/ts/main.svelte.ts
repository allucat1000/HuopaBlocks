import { HuopaBlocksRuntime } from "../ts/runtime";
import { type ProjectHeader, Type, NodeType, Shape, type Theme, type DragState } from "./types";

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

export const dragState: DragState = $state({
  block: null,
  sourceScriptId: null,
  sourceBlockId: null,
  hoveredSlot: null as Element | null,
});

export let project: ProjectHeader = $state({
  "name": "",
  "description": "",
  "variables": {},
  "blocks": []
});

export const runtime = new HuopaBlocksRuntime(project.variables);
