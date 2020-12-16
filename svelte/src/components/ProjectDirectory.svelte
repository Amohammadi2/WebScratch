<script>
    import { onMount } from "svelte";
    import { CWDPath, pathDelimiter } from "./../states";
    let { ipcRenderer }= require("electron");
    let fs = require("fs");

    let CWDFileList = [];
    let CWDFolderList = [];
    /**
     * @var relativePath
     * @description we use CWDPath as the base (root)
     * and `relativePath` is relative to the root dir
     */
    let relativePath = "";

    function initComponent() {
        initIPCRenderer();
        CWDPath.set(localStorage.getItem("CWDPath") || "");
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
        console.log("listing this path: " + path);
        let dirFileList = fs.readdirSync(path);
        console.log("found these files: ",dirFileList);
        dirFileList.forEach(file => {
            let filePath = `${path}${pathDelimiter}${file}`;
            fs.lstatSync(filePath).isDirectory()
                ? folders.push(file)
                : files.push(file);
        });
        CWDFileList = files;
        CWDFolderList = folders;

        console.log(CWDFileList)
        console.log(CWDFolderList)
    }

    function changeDirectory(rel_path){
        if (rel_path == ".."){
            let pathArray = relativePath.split(pathDelimiter);
            // delete the last item -> return back to the parent dir
            pathArray.splice((pathArray.length-1), 1);
            relativePath = pathArray.join(pathDelimiter);
        }
        else{
            relativePath += `${pathDelimiter}${rel_path}`;
        }
        listCWD($CWDPath+relativePath);
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
        <span class="material-icon round" on:click={(event)=>changeDirectory("..")}>
            <img src="./icons/back.svg" alt={"back"}/>
        </span>
        <ul class="file-list">
            {#each CWDFolderList as folder}
                <li on:click={(event)=>changeDirectory(folder)}>
                    <span class="material-icon">
                        <img src="./icons/folder.svg" alt={"folder:"}/>
                    </span>
                    <span class="file-name">{folder}</span>
                </li>
            {/each}
            {#each CWDFileList as file}
                <li>
                    <span class="file-name">{file}</span>
                </li>
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
        background-color: rgb(230, 230, 230);
        overflow-y: scroll;
        box-sizing: border-box;
        color: rgb(31, 31, 31);
        padding: 5px;

        .file-list {
            list-style: none;

            li {
                display: flex;
                align-items: center;
                justify-content: left;
                margin-top: 8px;
                margin-bottom: 8px;
                
                span {
                    margin: 0px 8px;
                }
            }
        }
    }

    .top-bar {
        position: fixed;
        display: flex;
        justify-content: left;
        align-items: center;
        top: 0;
        left: 0;
        right: 0;
        height: 50px;
    }
</style>