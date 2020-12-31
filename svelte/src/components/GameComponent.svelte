<script>
    import { activeComponent } from "../states";
    export let component;

    function setActiveComponent(event) {
        activeComponent.set(component);
    }
</script>

<div class="game-component {($activeComponent == component) && 'active'}" on:click={setActiveComponent}>
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