<script lang="ts">
    import { onMount } from "svelte";
    import { dragState } from "../ts/main.svelte";
    import { type BlockNode, Shape } from "../ts/types";

    let { value, index, onValueChange, onBlockDrop }: {
        value: string;
        index: number;
        onValueChange: (val: string) => void;
        onBlockDrop: (block: BlockNode) => void;
    } = $props();

    let hovering = $state(false);
    let inputEl: HTMLInputElement | undefined = $state();

    onMount(() => {
        const handler = (e: any) => onBlockDrop(e.detail.block);
        inputEl?.addEventListener("blockdrop", handler);
        return () => inputEl?.removeEventListener("blockdrop", handler);
    });

    function autoWidth(input: HTMLInputElement | undefined) {
        if (!input) return;
        const span = input.previousElementSibling as HTMLSpanElement;
        if (span) {
            span.textContent = input.value;
            requestAnimationFrame(() => input.style.width = Math.max(8, span.offsetWidth + 4) + 'px');
        }
    }

    document.addEventListener("mouseup", () => {
        if (hovering && dragState.block) {
            onBlockDrop(dragState.block);
        }
        hovering = false;
    })

    function onMouseEnter() {
        if (dragState.block?.shape === Shape.reporter || dragState.block?.shape === Shape.boolean) {
            hovering = true;
        }
    }

    function onMouseLeave() {
        hovering = false;
    }
</script>

<span class="BlockContentValueInputSize" aria-hidden="true"></span>
<input class="BlockContentValueInput" class:DropTarget={hovering} bind:this={inputEl} data-input-slot="true" {value} use:autoWidth oninput={(e) => { autoWidth(inputEl); onValueChange((e.currentTarget as HTMLInputElement).value) }} onmouseenter={onMouseEnter} onmouseleave={onMouseLeave} />