<script lang="ts">
    import type { PopupElementObject } from "../ts/types";

    const { elements, buttonText, closePopup }: { elements: Array<PopupElementObject>, buttonText: string, closePopup: Function } = $props();
</script>

<div class="PopupBackground">
    <div class="Popup">
        {#each elements as el} 
            <svelte:element this={el.tag} class={el.class}>{el.content}</svelte:element>
        {/each}
        <button onclick={() => closePopup()} class="PopupButton">{buttonText}</button>
    </div>
</div>