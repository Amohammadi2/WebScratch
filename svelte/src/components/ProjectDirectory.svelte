<script>
    import { onMount } from "svelte";
    import { SystemFile } from "../utils";
    import { 
        CWDPath, pathDelimiter, supportedFileFormats, codeEditorContents, isEditorOpened, projectFileName
    } from "./../states";

    const { ipcRenderer }= require("electron");
    const fs = require("fs");
    const { remote } = require("electron");
    const Menu = remote.Menu;

    let menu = Menu.buildFromTemplate([
        {
            label: "new",
            submenu: [
                {
                    label: "script"
                },
                {
                    label: "folder"
                }
            ],
        },
        {
            label: "refresh",
            click: ()=>listCWD($CWDPath),
        }
    ]);

    function createFolder() {
        // TODO: implement this function
    }

    function createScript() {
        // TODO: implement this function
    }

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
        if (path == $CWDPath && !(CWDFileList.includes(projectFileName))) {
            // initialize project directory
            new SystemFile ($CWDPath + pathDelimiter + projectFileName).writeJSON([]);
            // reload all the files
            listCWD(path);
        }
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

    function openFile(file_path, file_name) {
        let full_file_path = file_path + pathDelimiter + file_name;
        let file_ext = file_name.split(".").reverse()[0];
        if (supportedFileFormats.includes(file_ext)) {
            codeEditorContents.set
                ([fs.readFileSync(full_file_path, "utf8"), full_file_path, file_name]);
            isEditorOpened.set(true);
        }
    }

    function handleRightClick(event) {
        // console.log(Menu, MenuItem, remote);
        menu.popup();
    }

    CWDPath.subscribe((CWD) => {
        console.log("CWD: ", CWD);
        CWD && listCWD(CWD);
        CWDRoot = CWD.split(pathDelimiter).reverse()[0];
    });

    onMount(initComponent);
</script>

<div class="project-dirs-container" on:contextmenu={handleRightClick}>
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
                <li on:click={(event) => (openFile($CWDPath + relativePath, file))}>
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
        height: calc(50vh);
        background-color: rgb(230, 230, 230);
        overflow-y: scroll;
        box-sizing: border-box;
        color: rgb(31, 31, 31);
        padding: 5px;
        position: relative;

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