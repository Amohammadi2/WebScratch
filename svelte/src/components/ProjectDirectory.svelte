<script>
    import { onMount } from "svelte";
    import { CWDPath, pathDelimiter } from "./../states";
    let { ipcRenderer }= require("electron");
    let fs = require("fs");

    let CWDFileList = [];
    let CWDFolderList = [];
    let CWDRoot = ""; 
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

    /**
     * @function closeCWD
     * @description removes current working directory
     */
    function closeCWD() {
        if (confirm("Are you sure you want to close current working directory?")){
            CWDPath.set("");
            localStorage.removeItem("CWDPath");
        }
    }

    CWDPath.subscribe((CWD) => {
        CWD && listCWD(CWD);
        CWDRoot = CWD.split(pathDelimiter).reverse()[0];
    });

    onMount(initComponent);
</script>

<div class="project-dirs-container">
    {#if !($CWDPath)}
        <div class="justify-content-center">
            <button class="btn-primary btn-big" on:click={selectDirectory}>open folder</button>
        </div>
    {:else}
        <div class="top-bar">
            <span class="material-icon round item margin-hor-1" on:click={(event)=>{closeCWD()}}>
                <img src="./icons/close.svg" alt={"close"}/>
            </span>
            <span class="material-icon round item margin-hor-1" on:click={(event)=>changeDirectory("..")}>
                <img src="./icons/back.svg" alt={"back"}/>
            </span>
            <span class="item" id="path-nav">
                {CWDRoot + relativePath}
            </span>
        </div>
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
                    <span class="material-icon">
                        <img src="./icons/file.svg" alt={"file:"}/>
                    </span>
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
        position: relative;

        &::-webkit-scrollbar {
            width: 8px;
            margin-right: 10px;
        }

        /* Track */
        &::-webkit-scrollbar-track {
            background: #f1f1f1;
            padding: 3px;
        }

        /* Handle */
        &::-webkit-scrollbar-thumb {
            background: rgb(21, 90, 194);
        }

        /* Handle on hover */
        &::-webkit-scrollbar-thumb:hover {
            background: rgb(12, 39, 80);
        }

        .file-list {
            list-style: none;
            margin-top: 50px;

            li {
                display: flex;
                align-items: center;
                justify-content: left;
                margin-top: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                
                span {
                    margin: 0px 8px;
                }
            }
        }
    }

    .top-bar {
        position: absolute;
        display: flex;
        justify-content: left;
        align-items: center;
        top: 0;
        left: 0;
        right: 0;
        height: 50px;
        box-sizing: border-box;
        padding: 10px;

        .item {
            margin: 10px 0;
            margin-right: 8px;

            .margin-hor-1 {
                margin: 10px 0;
            }
        }

        #path-nav {
            background-color: rgb(21, 90, 194);
            color: white;
            padding: 3px 8px;
        }
    }
</style>