<script>
    import { isComponentCreatorOpened } from "../states";
    import { fade, fly } from "svelte/transition";
</script>

{#if $isComponentCreatorOpened}
    <div class="wrapper" transition:fade={{duration: 300}}>
        <div class="component-creator" transition:fly={{y: -300, duration: 400}}>
            <div class="header">
                <span 
                    on:click={event=>isComponentCreatorOpened.set(false)}
                    class="btn-alert"
                >&times;</span>
                <span>create a new game component</span>
            </div>
            <div class="body">
                <!-- TODO: add component fields here -->
            </div>
            <div class="footer">
                <button class="btn-alert btn-footer">close</button>
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
        }
    }
</style>