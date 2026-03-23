<script lang="ts">
    const { title, text, duration, close }: { title: string, text: string, duration: number, close: Function } = $props();
    let main: HTMLDivElement;
    setTimeout(() => {
        main.classList.add("ToastClosing");
        setTimeout(close, 1000);
    },
    // svelte-ignore state_referenced_locally
    duration);
</script>
<div class="Toast" bind:this={main}>
    <p class="ToastTitle">{title}</p>
    <p class="ToastDescription">{text}</p>
</div>