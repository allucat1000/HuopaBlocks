<script lang="ts">
    import type { CategoryNode } from "../ts/types";
    import Block from "./Block.svelte";
    import { onMount } from "svelte";

    export let BlockList: Array<CategoryNode>;

    onMount(() => {
        const style = document.createElement("style");
        style.textContent = BlockList.map(categ => `
            .Category-${categ.op} {
                --block-bg-color: ${categ.color};
                --block-border-color: ${categ.borderColor};
                --block-text-color: ${categ.textColor};
            }
        `).join("\n");
        document.head.appendChild(style);
    });
</script>

{#each BlockList as categ}
    <p class="BlockCategoryHeading">{categ.title}</p>
    {#each categ.children as block}
        <Block cl={"Category-" + categ.op} {block} palette={true} deleteBlock={() => {}} updateBlock={() => {}} ></Block>
    {/each}
{/each}