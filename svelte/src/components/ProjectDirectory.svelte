<script>
    import { onMount } from "svelte";
    import { CWDPath } from "./../states";
    let { ipcRenderer }= require("electron");

    function initComponent() {
        initIPCRenderer();
        CWDPath.set(localStorage.getItem("CWDPath") || "");
        console.log($CWDPath);
    }

    function initIPCRenderer() {
        ipcRenderer.on("directory-selected", (event, path) => {
           CWDPath.set(path);
           // *tip: CWD -> [C]urrent [W]orking [D]irectory
           localStorage.setItem("CWDPath", path);
        });
    }

    function selectDirectory(event) {
        ipcRenderer.send("select-directory");
    }

    onMount(initComponent);
</script>

<div class="project-dirs-container">
    {#if !($CWDPath)}
        <div class="justify-content-center">
            <button class="btn-primary btn-big" on:click={selectDirectory}>open folder</button>
        </div>
    {:else}
        <p>the path is: {$CWDPath}</p>
    {/if}
</div>

<style lang="scss">
    @import "./../variables.scss";
    @import "./../utils.scss";

    .project-dirs-container {
        width: $full;
        height: calc(100vh - #{$canvas-height});
        background-color: rgb(12, 12, 12);
        overflow-y: scroll;
        box-sizing: border-box;
        color: white;
        padding: 5px;
    }
</style>