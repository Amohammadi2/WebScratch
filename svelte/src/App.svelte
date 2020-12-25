<script>
    import { flip } from "svelte/animate";
    import { notifications } from "./states";
    import ProjectDirectory from "./components/ProjectDirectory.svelte";
    import CodeEditor from "./components/CodeEditor.svelte";
    import EditorWindow from "./components/EditorWindow.svelte";
    import ComponentsEditor from "./components/ComponentsEditor.svelte";
    import ComponentCreator from "./components/ComponentCreator.svelte";
    import Notification from "./components/Notification.svelte";

    function closeNotification (pk) {
        notifications.update((value) => {
            return value.filter((val) => (val.pk != pk));
        });
    }
</script>

<ComponentCreator />

<div class="notification-box">
    {#each $notifications as n (n.pk)}
        <div class="wrapper" animate:flip={{duration: 300}}>
            <Notification {...n} on:click={event=>closeNotification(n.pk)}/>
        </div>
    {/each}
</div>

<div class="main-container">
    <EditorWindow>
        <CodeEditor />
    </EditorWindow>
    <div class="col-left">
        f
    </div>
    <div class="col-middle">
        <ProjectDirectory />
        <ComponentsEditor />
    </div>
    <div class="col-right">
        <div class="game-canvas-container">
            <canvas id="game-canvas"></canvas>
        </div>
        <!-- shows the project files -->
    </div>
</div>

<style lang="scss">

    @import "./variables.scss";

    :global(body){
        padding: 0; margin: 0;
    }

    .notification-box {
        position: fixed;
        z-index: 999999; // should be always at the top
        bottom: 25px;
        right: 25px;
        width: 300px;
    }

    div.main-container {
        width: $full;
        
        .col-right {
            float: left;
            width: $canvas-width;
            
            .game-canvas-container {
                width: $full;
                height: $canvas-height;
                margin: 0; padding: 0;

                #game-canvas {
                    background-color: rgb(245, 245, 245);
                    width: $canvas-width;
                    height: $canvas-height;
                }
            }
        }

        .col-middle {
            float: left;
            width: 30%;
        }

        .col-left {
            float: left;
            width: calc(70% - #{$canvas-width});
        }
    }
</style>