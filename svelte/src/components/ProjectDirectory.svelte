<script>
    import { onMount } from "svelte";
    import { CWDPath } from "./../states";
    let { ipcRenderer }= require("electron");
    let fs = require("fs");

    let CWDFileList = [];
    let CWDFolderList = [];
    let a = [1,2];
    /**
     * @var relativePath
     * @description we use CWDPath as the base (root)
     * and `relativePath` is relative to the root dir
     */
    let relativePath = [];

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

    function listCWD(path) {
        let files = [];
        let folders = [];
        fs.readdir(path, (err,dirFileList) => {
            if (err) throw err;
            dirFileList.forEach(file => {
                console.log(file);
                let filePath = `${path}/${file}`;
                fs.lstatSync(filePath).isDirectory()
                    ? folders.push(file)
                    : files.push(file);
            });
            CWDFileList = files;
            CWDFolderList = folders;

            console.log(CWDFileList)
            console.log(CWDFolderList)
        });
    }

    CWDPath.subscribe((CWD) => CWD && listCWD(CWD));

    onMount(initComponent);
</script>

<div class="project-dirs-container">
    {#if !($CWDPath)}
        <div class="justify-content-center">
            <button class="btn-primary btn-big" on:click={selectDirectory}>open folder</button>
        </div>
    {:else}
        <ul class="file-list">
            {#each CWDFolderList as folder}
                <li>{folder}</li>
            {/each}
            {#each CWDFileList as file}
                <li>{file}</li>
            {/each}
        </ul>
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