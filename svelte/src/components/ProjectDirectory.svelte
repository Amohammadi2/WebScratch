<script>
    import { onMount } from "svelte";
    import { NotificationAPI, SystemFile, SystemFolder } from "../utils";
    import { 
        CWDPath, pathDelimiter, supportedFileFormats, codeEditorContents, isEditorOpened, projectFileName
    } from "./../states";
    import Prompt from "./Prompt.svelte";
    import FileListItem from "./FileListItem.svelte";

    const { ipcRenderer }= require("electron");
    const fs = require("fs");
    const { remote } = require("electron");
    const Menu = remote.Menu;

    let menu = Menu.buildFromTemplate([
        {
            label: "new",
            submenu: [
                {
                    label: "script",
                    click: ()=>openPromptWindow("create-script", "enter the script name:")
                },
                {
                    label: "folder",
                    click: ()=>openPromptWindow("create-folder", "enter the folder name:"),
                }
            ],
        },
        {
            label: "refresh",
            click: ()=>listCWD($CWDPath + relativePath),
        }
    ]);

    let openPrompt = false;
    let promptPurpose = "";
    let promptMsg = "";

    function openPromptWindow(purpose, msg) {
        if (!$CWDPath) {
            NotificationAPI.add("please open project directory first", "alert");
            return;
        }
        promptPurpose = purpose;
        promptMsg = msg;
        openPrompt = true;
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

    function createScript(script_path, script_name) {
        new SystemFile(script_path + pathDelimiter + script_name + ".js").write("");
    }

    function createFolder(folder_path, folder_name) {
        new SystemFolder(folder_path + pathDelimiter + folder_name).create();
    }

    function handleRightClick(event) {
        if (!$CWDPath) return;
        menu.popup();
    }

    function handlePromptMessage(event) {
        let { message, purpose } = event.detail;
        let actions = {
            "create-script": createScript,
            "create-folder": createFolder,
        }
        openPrompt = false;
        let path = $CWDPath + relativePath;
        actions[purpose](path, message);
        listCWD(path);
    }

    function handlePromptCancel() {
        openPrompt = false;
    }

    CWDPath.subscribe((CWD) => {
        console.log("CWD: ", CWD);
        CWD && listCWD(CWD);
        CWDRoot = CWD.split(pathDelimiter).reverse()[0];
    });

    onMount(initComponent);
</script>

<Prompt
    open={openPrompt}
    purpose={promptPurpose}
    msg={promptMsg}
    on:message={handlePromptMessage}
    on:cancel={handlePromptCancel}
/>
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
                <FileListItem 
                    name={folder}
                    icon={"folder"}
                    type={"folder"}
                    path={$CWDPath + relativePath + pathDelimiter + folder}
                    on:click={()=>changeDirectory(folder)}
                    on:refresh={()=>listCWD($CWDPath + relativePath)}
                />
            {/each}
            {#each CWDFileList as file}
                <FileListItem 
                    name={file}
                    icon={"file"}
                    type={"file"}
                    path={$CWDPath + relativePath + pathDelimiter + file}
                    on:click={()=>openFile($CWDPath + relativePath, file)}
                    on:refresh={()=>listCWD($CWDPath + relativePath)}
                />
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
        background-color: rgb(255, 255, 255);
        overflow-y: scroll;
        box-sizing: border-box;
        color: rgb(31, 31, 31);
        padding: 5px;
        position: relative;

        .file-list {
            list-style: none;
            margin-top: 50px;
            padding-left: 0;
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