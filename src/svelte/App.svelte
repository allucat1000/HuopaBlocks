<script lang="ts">
  import { Shape, NodeType, Type, BlockNodeContentType, type ProjectHeader, type ScriptNode } from "../ts/types";
  import { initTheme, project } from "../ts/main.svelte";
  import Script from "./Script.svelte";
  import Sidebar from "./Sidebar.svelte";
  import Topbar from "./Topbar.svelte";
  import { palette } from "../ts/palette";

  initTheme();
</script>

<Topbar />

<div class="Sidebar">
  <Sidebar BlockList={palette}/>
</div>

<div class="CodeArea">
  {#each project.blocks as script}
    <Script {script} 
      updateScript={(updated: ScriptNode) => { project.blocks = project.blocks.map(s => s.id === script.id ? updated : s); }}
      deleteScript={() => {
        project.blocks = [ ...project.blocks.filter(r => r.id !== script.id) ]
      }}>
    </Script>
  {/each}
</div>

<div class="CanvasArea"></div>