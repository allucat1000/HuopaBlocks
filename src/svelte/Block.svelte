<script lang="ts">
    import { onMount } from "svelte";
    import { type BlockNode, Shape, type ScriptNode, type BlockReference } from "../ts/types";
    import { BlockContents } from "../ts/palette";
    import { compile } from "../ts/compiler";
    import Block_ from "./Block.svelte";
    import { nanoid } from "nanoid";
    import { dragState, project } from "../ts/main.svelte";
    import { round } from "../ts/utils";
    import InputSlot from "./InputSlot.svelte";

    let { block, cl, palette, deleteBlock, updateBlock }: { block: BlockNode; cl: string; palette: boolean; deleteBlock: Function; updateBlock: Function } = $props();

    let main: HTMLDivElement | undefined = $state();

    // svelte-ignore state_referenced_locally
        const bl: BlockNode = {
            ...block,
            children: block.children.map(c => ({ ...c }))
        };

    function getPos() {
        return {
            x: parseFloat(main?.style.left || "0"),
            y: parseFloat(main?.style.top || "0")
        };
    }

    function autoWidth(input: HTMLInputElement) {
        const span = input.previousElementSibling as HTMLSpanElement;
        if (span) {
            span.textContent = input.value;
            requestAnimationFrame(() => input.style.width = Math.max(8, span.offsetWidth + 4) + 'px');
        }
    }

    function updateInput(e: Event, i: number) {
        const input = e.currentTarget as HTMLInputElement;
        const span = input.previousElementSibling as HTMLSpanElement;

        if (!input || !span) return;
        if (!("value" in bl.children[i])) return;

       const updatedBlock = {
            ...block,
            children: block.children.map((c, idx) =>
                idx === i && "value" in c ? { ...c, value: input.value } : c
            )
        };

        updateBlock(updatedBlock);
        span.textContent = input.value;

        requestAnimationFrame(() => {
            input.style.width =
                Math.max(8, span.offsetWidth + 4) + "px";
        });
    }

    let script: ScriptNode | undefined;

    function cloneBlock(block: BlockNode): BlockNode {
        return {
            ...block,
            id: nanoid(),
            children: block.children.map(c =>
                "value" in c
                    ? { ...c }
                    : cloneBlock(c)
            )
        };
    }

    onMount(() => {
        if (!main) return;

        if (block.shape === Shape.boolean) {
            main.classList.add("BooleanBlock");
        }

        if (block.shape === Shape.top) {
            main.classList.add("TopBlock");
        }

        if (block.shape === Shape.bottom) {
            main.classList.add("BottomBlock");
        }

        if (block.shape === Shape.reporter) {
            main.classList.add("ReporterBlock");
        }

        let dragStartX = 0;
        let dragStartY = 0;
        let dragging = false;
        let dragStart = 0;

        function mouseMove(e: MouseEvent) {
            if (!dragging || !main || (!palette && !script)) return;

            if (dragState.block) {
                // Temporarily hide the dragging element so elementFromPoint sees through it
                main.style.pointerEvents = "none";
                const el = document.elementFromPoint(e.clientX, e.clientY);
                main.style.pointerEvents = "";

                const slot = el?.closest("[data-input-slot]") ?? null;

                if (dragState.hoveredSlot && dragState.hoveredSlot !== slot) {
                    dragState.hoveredSlot.classList.remove("DropTarget");
                }

                if (slot) {
                    slot.classList.add("DropTarget");
                }

                dragState.hoveredSlot = slot;
            }

            main.style.left = `${e.clientX - dragStartX}px`;
            main.style.top = `${e.clientY - dragStartY}px`;
        }

        function mouseUp() {
            if (!dragging || !main) return;

            if (dragState.block && dragState.hoveredSlot) {
                dragState.hoveredSlot.classList.remove("DropTarget");
                dragState.hoveredSlot.dispatchEvent(new CustomEvent("blockdrop", {
                    bubbles: true,
                    detail: { block: dragState.block }
                }));
            }

            let taken: boolean = false;

            dragState.block = null;
            dragState.hoveredSlot = null;
            dragState.sourceScriptId = null;
            dragState.sourceBlockId = null;
            if (dragState.blockTaken) {
                dragState.blockTaken = false;
                taken = true;
            }

            document.body.classList.remove("Dragging");

            dragging = false;
            main.classList.remove("DraggingBlock");

            const { x, y } = getPos();

            const container = document.querySelector(".CodeArea")!;
            const rect2 = container.getBoundingClientRect();

            if (palette && x > 240 && !taken) {
                const d = document.querySelector(".CodeArea");
                if (d) {
                    const scrD: ScriptNode = {
                        x: round(x, 2),
                        y: round(y - rect2.top, 2),
                        id: nanoid(),
                        children: [cloneBlock(bl)]
                    };

                    project.blocks = [...project.blocks, scrD];
                }
            }

            document.removeEventListener("mousemove", mouseMove);
            document.removeEventListener("mouseup", mouseUp);
        }

        function mouseDown(e: MouseEvent) {
            if (!main) return;
            if ((e.target as HTMLElement).closest("input")) return;

            if (block.shape === Shape.reporter || block.shape === Shape.boolean) {
                dragState.block = cloneBlock(bl);
                dragState.sourceScriptId = null;
                dragState.sourceBlockId = block.id;
            }

            document.body.classList.add("Dragging");

            dragStart = Date.now();

            const rect = main.getBoundingClientRect();
            dragging = true;

            main.classList.add("DraggingBlock");

            dragStartX = e.clientX - rect.left;
            dragStartY = e.clientY - rect.top;

            main.style.left = `${e.clientX - dragStartX}px`;
            main.style.top = `${e.clientY - dragStartY}px`;

            requestAnimationFrame(() => {
                document.addEventListener("mousemove", mouseMove);
                document.addEventListener("mouseup", mouseUp);
            });
        }

        if (palette) main.addEventListener("mousedown", mouseDown);

        return () => {
            main?.removeEventListener("mousedown", mouseDown);
            document.removeEventListener("mousemove", mouseMove);
            document.removeEventListener("mouseup", mouseUp);
        };
    });
</script>

<div class={`${cl} Block`} bind:this={main}>
    {#if BlockContents[block.op]}
        {#each (BlockContents[block.op] ?? "").split("$$") as part, i}
            {#if part?.trim()?.length > 0}
                <span class="BlockContentText">{part}</span>
            {/if}

            {#if i < block.children.length}
                {@const child = block.children[i]}

                {#if "value" in child}
                    <InputSlot
                        value={child.value as string}
                        index={i}
                        onValueChange={(val: string) => updateBlock({
                            ...block,
                            children: block.children.map((c, idx) => idx === i ? { ...c, value: val } : c)
                        })}
                        onBlockDrop={(dropped: BlockNode) => { dragState.blockTaken = true; updateBlock({
                            ...block,
                            children: block.children.map((c, idx) => idx === i ? dropped : c)
                        })}}
                    />

                {:else if "op" in child}
                    <Block_ block={child} cl={`Category-${child.category}`} palette={false} deleteBlock={() => {}} updateBlock={() => {}}/>
                {/if}
            {/if}
        {/each}
    {/if}
</div>