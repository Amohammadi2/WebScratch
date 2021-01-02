<script>
    import { activeComponent, gameComponents } from "../states";
    export let component;

    const { remote } = require("electron");
    const { Menu } = remote;

    let menu = Menu.buildFromTemplate([
        {
            label: "remove component",
            click: ()=>removeComponent(),
        },
        {
            label: "edit properties",
            click: ()=>setActiveComponent(),
        }
    ]);

    function removeComponent() {
        if ($activeComponent == component) {
            activeComponent.set(null);
        }
        component.remove();
        gameComponents.update(val => {
            return val.filter(gc => {
                return (gc != component);
            });
        });
    }

    function setActiveComponent() {
        activeComponent.set(component);
    }

    function handleRightClick() {
        menu.popup();
    }
</script>

<div 
    class="game-component {($activeComponent == component) && 'active'}"
    on:click={setActiveComponent}
    on:contextmenu={handleRightClick}
>
    <span class="material-icon">
        <img src="./icons/component.svg" alt={"component"} />
    </span>
    <span class="comp-name">
        {component.body.label}
    </span>
</div>

<style lang="scss">
    @import "../utils.scss";

    .game-component {
        cursor: pointer;
        width: 100%;
        box-sizing: border-box;
        padding: 5px 4px;
        transition: all .09s ease-out;
        display: flex;
        flex-direction: row;
        align-items: center;

        &:hover {
            background-color: rgb(206, 237, 252);
        }

        &.active {
            background-color: rgb(0, 119, 179);
            color: white;
        }

        .comp-name {
            margin: 5px 8px;
        }
    }
</style>