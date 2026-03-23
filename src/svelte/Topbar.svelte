<script lang="ts">
    import { mount, unmount } from "svelte";
    import { project } from "../ts/main.svelte";
    import DarkIcon from "@lucide/svelte/icons/moon";
    import LightIcon from "@lucide/svelte/icons/sun";
    import { CurrentTheme } from "../ts/main.svelte";
    import Popup from "./Popup.svelte";
    import { PopupElementTag } from "../ts/types";
    let popupOpen: boolean = false;
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
</script>

<div class="Topbar">
    <p class="TopbarTitle">HuopaBlocks</p>
    {#if CurrentTheme.dark }
        <DarkIcon class="ThemeToggle" onclick={() => CurrentTheme.dark = !CurrentTheme.dark} />
    {:else}
        <LightIcon class="ThemeToggle" onclick={() => CurrentTheme.dark = !CurrentTheme.dark} />
    {/if}
    <button class="TopbarButton" onclick={viewJSON}>View project JSON</button>
    <input class="TopbarInput" placeholder="Give this project a name!" bind:value={project.name}>
</div>