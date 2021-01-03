<script>
    import { createEventDispatcher } from "svelte";
    import { activeComponent } from "../states";
    import { Dialogs, NotificationAPI, SystemFile, SystemFolder } from "../utils";
    import Prompt from "./Prompt.svelte";

    const { Menu } = require("electron").remote;
    const dispatch = createEventDispatcher();
    
    export let name;
    export let icon;
    export let type;
    export let path;
    let file = (type == "file")
        ? new SystemFile(path)
        : new SystemFolder(path);

    //#region prompt controls
    let promptOpen = false;
    let promptPurpose = "";
    let promptMessage = "";
    ////#endregion


    let fileMenu = Menu.buildFromTemplate([
        {
            label: "rename",
            click:()=>{
                promptOpen = true;
                promptPurpose = "rename";
                promptMessage = "enter the new name:";
            },
        },
        {
            label: "delete",
            click:()=>removeFile(),
        },
        {
            label: "assign as script",
            click:()=>assign(),
        }
    ]);

    let folderMenu = Menu.buildFromTemplate([
        {
            label: "rename",
            click:()=>Dialogs.alert("renamed"),
        },
        {
            label: "delete",
            click:()=>removeFolder(),
        },
    ]);

    function closePrompt() {
        promptOpen = false;
    }
    
    function removeFile() {
        file.remove();
        dispatch("refresh");
    }
    
    function removeFolder() {
        file.remove();
        dispatch("refresh");
    }

    function rename(new_name) {
        file.rename(new_name);
        dispatch("refresh");
    }

    function assign() {
        if (!$activeComponent) {
            NotificationAPI.add("please select a game component", "alert");
            return;
        }
        if (!name.endsWith(".js")) {
            NotificationAPI.add("only javascript files", "alert");
            return;
        }
        $activeComponent.scripts.update(val => {
            return [...val, {path, name}]
        });
    }

    function handleRightClick() {
        if (type == "folder") folderMenu.popup();
        else if (type == "file") fileMenu.popup();
    }

    function handlePromptMessage(event) {
        let { message, purpose } = event.detail;
        let actions = {
            rename,
        };
        actions[purpose](message);
        closePrompt();
    }
</script>

<Prompt
    msg={promptMessage}
    purpose={promptPurpose}
    open={promptOpen}
    on:message={handlePromptMessage}
    on:cancel={closePrompt}
/>

<li on:click on:contextmenu|stopPropagation={handleRightClick}>
    <span class="material-icon">
        <img src="./icons/{icon}.svg" alt={"icon:"}/>
    </span>
    <span class="file-name">{name}</span>
</li>

<style lang="scss">
    @import "./../variables.scss";
    @import "./../utils.scss";

    li {
        display: flex;
        align-items: center;
        justify-content: left;
        padding: 8px 5px;
        cursor: pointer;
        transition: all .09s ease-out;
        user-select: none;
        
        span {
            margin: 0px 8px;
        }
        
        &:hover {
            background-color: rgb(223, 233, 248);
        }
    }
</style>