<script>
    import { activeComponent, isPhysicsEngineRunning } from "../states";
    import Property from "./Property.svelte";
    import FieldSet from "./FieldSet.svelte";
    import Field from "./Field.svelte";

    let width, height, x, y, scale_x, scale_y;
    let isStatic, isSensor, isSleeping;

    activeComponent.subscribe(component => {
        console.log(component);
        if (component) {
            const { min, max} =  component.body.bounds;
            const position = component.body.position;
            const render = component.body.render;
            scale_x = render.sprite.xScale;
            scale_y = render.sprite.yScale;
            width = (max.x - min.x) / scale_x;
            height = max.y - min.y / scale_y;
            x = position.x;
            y = position.y;
            isStatic = component.body.isStatic || false;
            isSensor = component.body.isSensor || false;
            isSleeping = component.body.isSensor || false;
        }
    });
    $: if ($activeComponent) {
        Matter.Events.on(PhysicsEngine, "beforeUpdate", function callbackFN(event) {
            Matter.Body.scale($activeComponent.body, scale_x, scale_y);
            window.secret= $activeComponent;
            // remove the handler so that it gets called just once
            Matter.Events.off(PhysicsEngine, "beforeUpdate", callbackFN);
        });
    }
</script>

{#if $activeComponent}
    {#if $isPhysicsEngineRunning}
        <div class="banner fixed dark">
            stop the engine to access
        </div>
    {/if}
    <Property title={"transform"}>
        <FieldSet groupName={"position"}>
            <Field label={"width"}>
                <input type="number" bind:value={width}>
            </Field>
            <Field label={"height"}>
                <input type="number" bind:value={height}>
            </Field>
            <Field label={"offset X"}>
                <input type="number" bind:value={x}>
            </Field>
            <Field label={"offset Y"}>
                <input type="number" bind:value={y}>
            </Field>
        </FieldSet>
        <FieldSet groupName={"scale"}>
            <Field label={"scale X"}>
                <input type="number" bind:value={scale_x}>
            </Field>
            <Field label={"scale Y"}>
                <input type="number"  bind:value={scale_y}>
            </Field>
        </FieldSet>
    </Property>

    <Property title={"stats"}>
        <FieldSet groupName={"interactions"}>
            <Field label={"is static"}>    
                <input type="checkbox" bind:checked={$activeComponent.body.isStatic}>
            </Field>
            <Field label={"is sensor"}>    
                <input type="checkbox" bind:checked={$activeComponent.body.isSensor}>
            </Field>
            <Field label={"is sleeping"}>    
                <input type="checkbox" bind:checked={$activeComponent.body.isSleeping}>
            </Field>
        </FieldSet>
    </Property>
{:else}
    <div class="banner">
        <span>no components selected</span>
    </div>
{/if}

<style lang="scss">
    @import "../variables.scss";
    
    input {
            
        &[type="text"], &[type="password"], &[type="number"] {
            width: 100%;
        }

        &[type="checkbox"], &[type="radio"] {
            margin-left: 10px;
        }
    }

    .banner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        color: rgb(77, 77, 77);
        
        &.fixed {
            position: fixed;
            z-index: 10;
            top: 0;
            left: 0;
            width: calc(70% - #{$canvas-width});

            &.dark {
                background-color: rgba(22, 22, 22, 0.76);
            }
        }
    }
</style>