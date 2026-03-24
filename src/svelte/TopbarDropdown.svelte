<script lang="ts">
    import type { Snippet } from "svelte";

    let { title, children, visible = $bindable(false) }: { title: string, children: Snippet, visible: boolean } = $props(); 

    let open = $state(visible);

    $effect(() => {
        open = visible;
    });

</script>
<div class="TopbarDropdown">
    <button onclick={() => visible = !visible} class={`TopbarButton ${open ? "TopbarDropdownOpen" : ""}`} {title}>{title}</button>
    <div class={`TopbarDropdownOptions ${open ? "" : "Hidden"}`}>
        {@render children()}
    </div>
</div>