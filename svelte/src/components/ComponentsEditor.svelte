<script>
    import { CWDPath, gameComponents, isComponentCreatorOpened } from "../states";
    import { NotificationAPI } from "../utils";
    function openComponentCreator(event) {
        if (!$CWDPath) {
            NotificationAPI.add("please open project directory first", "alert");
            return;
        }
        isComponentCreatorOpened.set(true);
    }
</script>

<div class="components-editor">
    <div class="header">
        <span class="title">Game Components</span>
        <span class="title">
            <span class="action-btn" on:click={openComponentCreator}>+</span>
        </span>
    </div>
    <div class="items">
        {#each gameComponents as component}
            <div class="item">{component.label}</div>
        {/each}
    </div>
</div>

<style lang="scss">
    @import "../variables.scss";

    .components-editor {
        width: $full;
        height: 50vh;
        background-color: rgb(250, 250, 250);
        overflow-y: scroll;

        &::-webkit-scrollbar {
            width: 8px;
            margin-right: 10px;
        }

        /* Track */
        &::-webkit-scrollbar-track {
            background: #f1f1f1;
            padding: 3px;
        }

        /* Handle */
        &::-webkit-scrollbar-thumb {
            background: rgb(21, 90, 194);
        }

        /* Handle on hover */
        &::-webkit-scrollbar-thumb:hover {
            background: rgb(12, 39, 80);
        }

        .header {
            width: $full;
            background-color: rgb(44, 44, 44);
            color: white;
            padding: 8px 5px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            height: 30px;

            .title{
                line-height: 15px;
            }

            .action-btn {
                cursor: pointer;
                color: white;
                line-height: 15px;
                font-size: 18px;
            }
        }
    }
</style>