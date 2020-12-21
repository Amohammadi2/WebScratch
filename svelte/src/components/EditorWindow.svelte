<script>
    import { isEditorOpened } from "../states";
    import { fly } from "svelte/transition";
</script>

{#if $isEditorOpened}
    <div class="editor-window" transition:fly={{y: -200, duration: 300}}>
        <slot></slot>
    </div>
{/if}

<style lang="scss">
    .editor-window {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 10;
        background-color: rgb(255, 255, 255);
    }
</style>