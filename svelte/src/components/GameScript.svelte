<script>
    import { get } from "svelte/store";

    import { Dialogs } from "../utils";

    const { Menu } = require("electron").remote;
    
    export let name;
    export let path;
    export let component;

    let menu = Menu.buildFromTemplate([
        {
            label: "remove script",
            click:()=> {
                let scripts = get(component.scripts);
                component.scripts.set(scripts.filter(v => v.path != path));
            },
        }
    ]);

    function handleRightClick() {
        menu.popup();
    }
</script>

<div class="script" on:contextmenu={handleRightClick}>
    {name}
</div>

<style lang="scss">
    @import "../variables.scss";

    .script {
        width: 100%;
        box-sizing: border-box;
        padding: 8px 5px;
        transition: all .09s ease-out;
        cursor: pointer;

        &:hover {
            background-color: $light-blue-2;
        }
    }
</style>