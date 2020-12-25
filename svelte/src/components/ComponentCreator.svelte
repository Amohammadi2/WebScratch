<script>
    import { isComponentCreatorOpened } from "../states";
    import { fade, fly } from "svelte/transition";

    let closeComponentCreator = (event) =>
        isComponentCreatorOpened.set(false);

</script>

{#if $isComponentCreatorOpened}
    <div class="wrapper" transition:fade={{duration: 300}} on:click={closeComponentCreator}>
        <div class="component-creator" transition:fly={{y: -300, duration: 400}}>
            <div class="header">
                <span 
                    on:click={closeComponentCreator}
                    class="btn-alert"
                >&times;</span>
                <span>create a new game component</span>
            </div>
            <div class="body">
                <input type="text" class="form-input" placeholder="label">
                <select class="form-input">
                    <option value="rectangle">Rectangle</option>
                </select>
                <input type="number" min="0" class="form-input-small" placeholder="offset X:">
                <input type="number" min="0" class="form-input-small" placeholder="offset Y:">
                <input type="number" min="0" class="form-input-small" placeholder="width:">
                <input type="number" min="0" class="form-input-small" placeholder="height:">
            </div>
            <div class="footer">
                <button class="btn-alert btn-footer" on:click={closeComponentCreator}>close</button>
                <button class="btn-primary btn-footer">create</button>
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

        }
    }
</style>