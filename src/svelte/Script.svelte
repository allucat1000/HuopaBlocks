<script lang="ts">
    import { mount, onMount } from "svelte";
    import { NodeType, Shape, type BlockNode, type BlockReference, type ScriptNode } from "../ts/types";
    import Block from "./Block.svelte";
    import { compile } from "../ts/compiler";
    import { dragState, project } from "../ts/main.svelte";
    import { Thread } from "../ts/runtime";
    import { runtime } from "../ts/main.svelte";
    import { round } from "../ts/utils";
    import { nanoid } from "nanoid";

    const { script, updateScript, deleteScript }: { script: ScriptNode, updateScript: Function, deleteScript: Function } = $props();

    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStart = 0;

    let main: HTMLDivElement | undefined = $state();

    function getPos() {
        return {
            x: parseFloat(main?.style.left || "0"),
            y: parseFloat(main?.style.top || "0")
        };
    }

    onMount(() => {
        if (!main) return;
        function mouseMove(e: MouseEvent) {
            if (!dragging || !main) return;

            if (dragState.block) {
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
        
        function blockCollection() {
            const blocks: BlockReference[] = [];
            project.blocks.forEach(s => {
                s.children.forEach((c, i) => {
                    blocks.push({ block: c, script: s, index: i})
                })
            })
            return blocks;
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


            const { x, y } = getPos();

            document.body.classList.remove("Dragging");

            dragging = false;
            main.classList.remove("DraggingBlock");

            moveScript(x, y);

            document.removeEventListener("mousemove", mouseMove);
            document.removeEventListener("mouseup", mouseUp);

            if (Date.now() - dragStart < 100 && !taken) {
                if (main.children?.[0]?.classList?.contains("BlockError") || main.children?.[0]?.classList?.contains("BlockGlow")) {
                    for (const c of main.children)
                        c?.classList?.remove("BlockGlow", "BlockError");
                    return;
                }

                for (const c of main.children)
                    c.classList.add("BlockGlow");


                const inmutableRuntime = new Proxy(runtime, {
                    get(target, prop) {
                        const val = target[prop as keyof typeof target];
                        return typeof val === "function" ? val.bind(target) : val;
                    },
                    set(target, prop, value) {
                        const allowed = ["variables", "targets", "events", "threads"];
                        if (allowed.includes(prop as string)) {
                            target[prop as keyof typeof target] = value;
                            return true;
                        }
                        return false;
                    }
                });
                
                const thread = new Thread();
                const fct = compile(script.children);
                const create = eval(fct);
                const gen = create(inmutableRuntime)(thread)();
                thread.gen = gen;

                gen.next();

                let r: boolean = false;
                let greenFlagScriptRunning: boolean = true;

                const removeGlow = () => {
                    if (main) for (const c of main.children) c.classList.remove("BlockGlow");
                };

                thread.onStop = () => {
                    if (!r) removeGlow();
                }

                thread.onCrash = () => {
                    if (main) for (const c of main.children) c.classList.add("BlockError");
                }

                runtime.runThread(thread);
                r = runtime.singularThreadStart(thread, () => { greenFlagScriptRunning = false; removeGlow() });
                if (r) if (greenFlagScriptRunning) for (const c of main.children)
                    c.classList.add("BlockGlow");
            

                return;
            }

            if (x < 240 || taken) {
                deleteScript();
                return;
            }

            if (script.children.length === 1) {
                const block = script.children[0];
                if (block.shape !== Shape.middle && block.shape !== Shape.bottom) return;
                const col = blockCollection();

                let closest: BlockReference | null = null;
                let mDist = Infinity;


                for (const ref of col) {
                    if (ref.script.id === script.id && ref.block.id === block.id) continue;

                    const height = main.getBoundingClientRect().height;
                    const b = ref.script.y + height;
                    const dist = getPos().y - b
                    if (dist >= 0 && dist < mDist && dist < 30 && Math.abs(getPos().x - ref.script.x) < 50) {
                        console.log(ref.script.y, dist);
                        mDist = dist;
                        closest = ref;
                    }
                }

                if (closest) {
                    if (closest.block.shape !== Shape.middle && closest.block.shape !== Shape.top) return;
                    const block = script.children[0];

                    const newBlocks = project.blocks.map(s => {
                        if (s.id === script.id) {
                            const children = s.children.filter(b => b.id !== block.id);
                            if (children.length === 0) return null;
                            return { ...s, children };
                        } 
                        if (s.id === closest.script.id) {
                            const idx = closest.index + 1;
                            const children = [
                                ...s.children.slice(0, idx),
                                block,
                                ...s.children.slice(idx)
                            ];
                            return { ...s, children };
                        }
                        return s;
                    }).filter(Boolean) as ScriptNode[];

                    project.blocks = newBlocks;
                }
            }
        }

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

        function mouseDown(e: MouseEvent) {
            if (!main) return;
            if ((e.target as HTMLElement).closest("input")) return;
            if (script.children.length === 1) {
                const block = script.children[0];
                if (block.shape === Shape.reporter || block.shape === Shape.boolean) {
                    dragState.block = cloneBlock(block);
                    dragState.sourceScriptId = null;
                    dragState.sourceBlockId = block.id;
                }
            }
            
            document.body.classList.add("Dragging");

            dragStart = Date.now();

            const rect = main.getBoundingClientRect();
            dragging = true;

            const container = document.querySelector(".CodeArea")!;
            const rect2 = container.getBoundingClientRect();


            main.classList.add("DraggingBlock");

            dragStartX = e.clientX - rect.left + rect2.left;
            dragStartY = e.clientY - rect.top + rect2.top;

            main.style.left = `${e.clientX - dragStartX}px`;
            main.style.top = `${e.clientY - dragStartY}px`;

            requestAnimationFrame(() => {
                document.addEventListener("mousemove", mouseMove);
                document.addEventListener("mouseup", mouseUp);
            });
        }

        main.addEventListener("mousedown", mouseDown);

        return () => {
            main?.removeEventListener("mousedown", mouseDown);
            document.removeEventListener("mousemove", mouseMove);
            document.removeEventListener("mouseup", mouseUp);
        };
    })

    function moveScript(newX: number, newY: number) {
        updateScript({
            ...script,
            x: round(newX, 2),
            y: round(newY, 2)
        });
    }

    function deleteBlock(blockToRemove: BlockNode) {
        updateScript({
            ...script,
            children: script.children.filter(b => b !== blockToRemove)
        });
    }

    function getBlockClass(shape: Shape) {
        if (shape === Shape.boolean) return "BooleanBlock";
        if (shape === Shape.top) return "TopBlock";
        if (shape === Shape.bottom) return "BottomBlock";
        if (shape === Shape.reporter) return "ReporterBlock";
        return "";
    }
</script>

<div class="BlockScript" style={`left: ${script.x}px; top: ${script.y}px;`} bind:this={main}>
    {#each script.children as block (block.id)}
        <Block {block} cl={`Category-${block.category} ${getBlockClass(block.shape)}`} palette={false} {deleteBlock} updateBlock={(b: BlockNode) =>
        updateScript({
            ...script,
            children: script.children.map(c => c.id === b.id ? b : c)
        })}></Block>
    {/each}
</div>