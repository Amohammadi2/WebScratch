<script>
    import { createEventDispatcher } from "svelte";
    import { fade, fly } from "svelte/transition";
    export let open = false;
    export let purpose = ""; // whatever
    export let msg = "";

    let dispatch = createEventDispatcher();
    let promptText = "";

    function sendResults() {
        dispatch("message", {
            message: promptText,
            purpose,
        });
        promptText = ""; // reset
    }

    function abort() {
        dispatch("cancel");
    }
</script>

{#if open}
    <div class="wrapper" transition:fade={{duration: 200}}>
        <div class="dialog" transition:fly={{duration: 300, y: -200}}>
            <div class="header">
                <span id="close-btn" on:click={abort}>&times;</span>
            </div>
            <div class="msg">
                <div style="margin-bottom: 10px;">{msg}</div>
                <input type="text" class="prompt-input" bind:value={promptText}>
            </div>
            <div class="footer">
                <button class="btn-primary" on:click={sendResults}>OK</button>
                <button class="btn-secnodary" on:click={abort}>Cancel</button>
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    .wrapper {
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 9999;
        background-color: rgba(46, 46, 46, 0.74);
        .dialog {
            width: 40%;
            height: 200px;
            background-color: rgb(255, 255, 255);
            position: relative;

            .header {
                display: flex;
                justify-content: left;
                align-items: center;
                background-color: rgb(236, 236, 236);
                height: 25px;

                #close-btn {
                    text-align: center;
                    padding: 4px 8px;
                    line-height: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    background-color: rgb(212, 212, 212);
                    cursor: pointer;
                }
            }

            .msg {
                width: 100%;
                box-sizing: border-box;
                padding: 20px 5%;

                input {
                    width: 100%;
                }
            }

            .footer {
                display: flex;
                justify-content: left;
                align-items: center;
                width: 100%;
                box-sizing: border-box;
                padding: 5px 5%;
                position: absolute;
                bottom: 0;
                background-color: rgb(250, 250, 250);

                button {
                    padding: 6px 10px;
                    box-sizing: border-box;
                    width: 70px;
                    margin: 0;
                    margin-right: 10px;
                    cursor: pointer;
                    transition: all .09s ease-out;

                    &.btn-primary {
                        background-color: rgb(10, 109, 238);
                        color: white;

                        &:hover {
                            background-color: rgb(6, 84, 185);
                        }
                    }

                    &.btn-secondary {
                        background-color: rgb(255, 255, 255);

                        &:hover {
                            background-color: rgb(236, 236, 236);
                        }
                    }
                }
            }
        }
    }
</style>