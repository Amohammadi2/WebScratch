<script>
    import ProjectDirectory from "./components/ProjectDirectory.svelte";
</script>

<div class="main-container">
    <div class="col-left">
        <span>f </span>
    </div>
    <div class="col-right">
        <div class="game-canvas-container">
            <canvas id="game-canvas"></canvas>
        </div>
        <!-- shows the project files -->
        <ProjectDirectory /> 
    </div>
</div>

<style lang="scss">

    @import "./variables.scss";

    :global(body){
        padding: 0; margin: 0;
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

        .col-left {
            float: left;
            width: calc(#{$full} - #{$canvas-width});
        }
    }
</style>