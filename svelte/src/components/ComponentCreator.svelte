<script>
    import { fade, fly } from "svelte/transition";
    import { isComponentCreatorOpened, gameComponents } from "../states";
    import { GameObject } from "../utils";

    let type, x, y, width, height;
    let isStatic, isSensor, isSleeping, label;

    let closeComponentCreator = (event) =>
        isComponentCreatorOpened.set(false);

    function createComponent(event) {
        console.log(label, type, x , y, width, height);
        let newGameComponent = new GameObject("body" ,type, x, y, width, height, {
            label,
            isStatic,
            isSensor,
            isSleeping,
        });
        newGameComponent.create();
        newGameComponent.add(); // add it to the world
        gameComponents.update(value => { 
            return [...value, newGameComponent];
        });
        closeComponentCreator();
    }
</script>

{#if $isComponentCreatorOpened}
    <div class="wrapper" transition:fade={{duration: 300}}>
        <div class="component-creator" transition:fly={{y: -300, duration: 400}}>
            <div class="header">
                <span 
                    on:click={closeComponentCreator}
                    class="btn-alert"
                >&times;</span>
                <span>create a new game component</span>
            </div>
            <div class="body">
                <input type="text" class="form-input" placeholder="label" bind:value={label}>
                <select class="form-input" bind:value={type}>
                    <option value="rectangle">Rectangle</option>
                </select>
                <input type="number" min="0" class="form-input-small" placeholder="offset X:" bind:value={x}>
                <input type="number" min="0" class="form-input-small" placeholder="offset Y:" bind:value={y}>
                <input type="number" min="0" class="form-input-small" placeholder="width:" bind:value={width}>
                <input type="number" min="0" class="form-input-small" placeholder="height:" bind:value={height}>
                <br>
                <div class="checkboxes">
                    <label class="form-input-small">
                        is static:
                        <input type="checkbox" bind:checked={isStatic}>
                    </label>
                    <label class="form-input-small">
                        is sensor:
                        <input type="checkbox" bind:checked={isSensor}>
                    </label>
                    <label class="form-input-small">
                        is sleeping:
                        <input type="checkbox" bind:checked={isSleeping}>
                    </label>
                </div>
            </div>
            <div class="footer">
                <button class="btn-alert btn-footer" on:click={closeComponentCreator}>close</button>
                <button class="btn-primary btn-footer" on:click={createComponent}>create</button>
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    $white-gray: rgb(248, 248, 248);
    .wrapper {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background-color: rgba(56, 56, 56, 0.568);
        z-index: 100;
        .component-creator {
            margin-top: 50px;
            margin-left: 20%;
            width: 60%;
            height: 400px;
            background-color: white;
            border-radius: 12px;
            position: relative;

            .header {
                display: flex;
                justify-content: left;
                align-items: center;
                background-color: $white-gray;
            }

            .footer {
                background-color: $white-gray;
                position: absolute;
                bottom: 0;
                right: 0;
                left: 0;
            }

            .btn {
                cursor: pointer;
                padding: 5px 10px;
                transition: all .09s ease-out;
                margin-right: 12px;
                outline: none;
            }

            .btn-alert {
                @extend .btn;
                background-color: rgb(206, 21, 21);
                color: white;

                &:hover{ 
                    background-color: rgb(167, 23, 23);
                }
            }

            .btn-primary {
                @extend .btn;
                background-color: rgb(1, 106, 204);
                color: white;

                &:hover{ 
                    background-color: rgb(22, 89, 143);
                }
            }

            .btn-footer {
                float: right;
                margin-top: 10px;
            }

            .form-input {
                width: 97%;
                margin: 9px 1.5%;
            }

            .form-input-small{
                @extend .form-input;
                width: 130px;
                margin: 9px 1.5%;
            }

            .checkboxes {
                display: flex;
                flex-direction: row;
                align-items: center;
            }

        }
    }
</style>