<script>
    import { writable } from "svelte/store";
    import { activeComponent, isPhysicsEngineRunning } from "../states";
    import Property from "./Property.svelte";
    import FieldSet from "./FieldSet.svelte";
    import Field from "./Field.svelte";

    let width = writable(0), height = writable(0);
    let x = writable(0), y = writable(0);
    let scale_x = writable(0), scale_y = writable(0);
    let isStatic = writable(false), isSensor = writable(false), isSleeping = writable(false);
    let fillStyle = writable("rgb(25, 25, 25)");

    activeComponent.subscribe(component => {
        if (component) {
            width.set(component.bounds.width);
            height.set(component.bounds.height);
            x.set(component.offset.x);
            y.set(component.offset.y);
            scale_x.set(component.scale.xScale);
            scale_y.set(component.scale.yScale);
            isStatic.set(component.options.isStatic);
            isSensor.set(component.options.isSensor);
            isSleeping.set(component.options.isSleeping);
        }
    });

    function reloadComponent() {
        if ($activeComponent)
            $activeComponent.reconstruct();
    }

    width.subscribe(v => {
        if (!$activeComponent) return;
        $activeComponent.bounds.width = v;
        reloadComponent();
    });

    height.subscribe(v => {
        if (!$activeComponent) return;
        $activeComponent.bounds.height = v;
        reloadComponent();
    });

    x.subscribe(v => {
        if (!$activeComponent) return;
        $activeComponent.offset.x = v;
        reloadComponent();
    });

    y.subscribe(v => {
        if (!$activeComponent) return;
        $activeComponent.offset.y = v;
        reloadComponent();
    });

    scale_x.subscribe(v => {
        if (!$activeComponent) return;
        $activeComponent.scale.xScale = v;
        reloadComponent();
    });

    scale_y.subscribe(v => {
        if (!$activeComponent) return;
        $activeComponent.scale.yScale = v;
        reloadComponent();
    });

    isStatic.subscribe(v => {
        if (!$activeComponent) return;
        $activeComponent.options.isStatic = v;
        reloadComponent();
    });

    isSensor.subscribe(v => {
        if (!$activeComponent) return;
        $activeComponent.options.isSensor = v;
        reloadComponent();
    });

    isSleeping.subscribe(v => {
        if (!$activeComponent) return;
        $activeComponent.options.isSleeping = v;
        reloadComponent();
    });

    fillStyle.subscribe(v => {
        if (!$activeComponent) return;
        $activeComponent.options.render.fillStyle = v;
        reloadComponent();
    });
</script>

{#if $activeComponent}
    {#if $isPhysicsEngineRunning}
        <div class="banner fixed" id="cover">
            stop the engine to access
        </div>
    {/if}
    <Property title={"transform"}>
        <FieldSet groupName={"bounds"}>
            <Field label={"width"}>
                <input type="number" bind:value={$width}>
            </Field>
            <Field label={"height"}>
                <input type="number" bind:value={$height}>
            </Field>
        </FieldSet>
        <FieldSet groupName={"position"}>
            <Field label={"offset X"}>
                <input type="number" bind:value={$x}>
            </Field>
            <Field label={"offset Y"}>
                <input type="number" bind:value={$y}>
            </Field>
        </FieldSet>
        <FieldSet groupName={"scale"}>
            <Field label={"scale X"}>
                <input type="number" bind:value={$scale_x}>
            </Field>
            <Field label={"scale Y"}>
                <input type="number"  bind:value={$scale_y}>
            </Field>
        </FieldSet>
    </Property>

    <Property title={"stats"}>
        <FieldSet groupName={"interactions"}>
            <Field label={"is static"}>    
                <input type="checkbox" bind:checked={$isStatic}>
            </Field>
            <Field label={"is sensor"}>    
                <input type="checkbox" bind:checked={$isSensor}>
            </Field>
            <Field label={"is sleeping"}>    
                <input type="checkbox" bind:checked={$isSleeping}>
            </Field>
        </FieldSet>
    </Property>
    <Property title={"material"}>
        <FieldSet groupName={"colors"}>
            <Field label={"background color"}>
                <input type="color" bind:value={$fillStyle}>
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
        }

        &#cover {
            background-color: rgba(230, 230, 230, 0.795);
        }
    }
</style>