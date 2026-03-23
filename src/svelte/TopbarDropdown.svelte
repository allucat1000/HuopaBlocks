<script lang="ts">
    import type { Snippet } from "svelte";

    const { title, children }: { title: string, children: Snippet } = $props(); 

    let visible: boolean = $state(false);
</script>
<div class="TopbarDropdown">
    <button onclick={() => visible = !visible} class="TopbarButton" {title}>{title}</button>
    <div class={`TopbarDropdownOptions ${visible ? "" : "Hidden"}`}>
        {@render children()}
    </div>
</div>