<script lang="ts">
    import { mount, unmount } from "svelte";
    import { project } from "../ts/main.svelte";
    import DarkIcon from "@lucide/svelte/icons/moon";
    import LightIcon from "@lucide/svelte/icons/sun";
    import { CurrentTheme } from "../ts/main.svelte";
    import Popup from "./Popup.svelte";
    import { PopupElementTag, type ProjectHeader } from "../ts/types";
    import TopbarDropdown from "./TopbarDropdown.svelte";
    import { buildProjectZip, loadProjectJSON } from "../ts/file";

    let popupOpen: boolean = false;
    let projectDropdownVisiblity: boolean = $state(false);

    function viewJSON() {
        if (popupOpen) return;
        popupOpen = true;
        const p = mount(Popup, {
            target: document.querySelector("#main")!,
            props: {
                elements: [
                    {
                        tag: PopupElementTag.h2,
                        class: "PopupTitle",
                        content: "Project JSON"
                    },
                    {
                        tag: PopupElementTag.code,
                        class: "",
                        content: JSON.stringify($state.snapshot(project), null, 2)
                    }
                ],
                buttonText: "Close",
                closePopup: () => { popupOpen = false; unmount(p) }
            }
        });
    }

    async function saveProject() {
        projectDropdownVisiblity = false;
        const a = document.createElement("a");

        const data = JSON.stringify(project, null, 2);
        const blob = await buildProjectZip(data);

        const url = URL.createObjectURL(blob);

        a.href = url;
        a.download = `${project.name || "project"}.hblock`;

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function loadProject(e: Event) {
        projectDropdownVisiblity = false;
        const data = (e.target as HTMLInputElement).files?.[0];
        if (!data) return;

        (e.target as HTMLInputElement).value = "";

        const r = new FileReader();
        r.onload = (e) => {
            try {
                const blob = new Blob([e.target?.result as ArrayBuffer]);
                loadProjectJSON(blob);
            } catch {}
        };
        r.readAsArrayBuffer(data);
    }
</script>

<div class="Topbar">
    <p class="TopbarTitle">HuopaBlocks</p>
    {#if CurrentTheme.dark }
        <DarkIcon class="ThemeToggle" onclick={() => CurrentTheme.dark = !CurrentTheme.dark} />
    {:else}
        <LightIcon class="ThemeToggle" onclick={() => CurrentTheme.dark = !CurrentTheme.dark} />
    {/if}
    <TopbarDropdown title="Project" bind:visible={projectDropdownVisiblity}>
        <button class="TopbarDropdownOption" title="Save Project" onclick={saveProject}>Save Project</button>
        <div class="TopbarDropdownOption TopbarDropdownInputOption">
            <input class="ProjectLoadInput" onchange={loadProject} type="file" title="Load Project"><span>Load Project</span>
        </div>
        <button class="TopbarDropdownOption" title="View JSON Data" onclick={viewJSON}>View JSON Data</button>
    </TopbarDropdown>
    <input class="TopbarInput" placeholder="Give this project a name!" bind:value={project.name}>
</div>