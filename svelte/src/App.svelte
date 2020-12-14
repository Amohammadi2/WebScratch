<div class="main-container">
    <div class="col-left">
        <span>f </span>
    </div>
    <div class="col-right">
        <div class="game-canvas-container">
            <canvas id="game-canvas"></canvas>
        </div>
        <section class="project-dirs-container"></section>
    </div>
</div>

<style lang="scss">

    $full-width: 100%;
    $canvas-width: 500px;
    $canvas-height: 350px;

    :global(body){
        padding: 0; margin: 0;
    }
    div.main-container {
        width: $full-width;
        
        .col-right {
            float: left;
            width: $canvas-width;
            
            .game-canvas-container {
                width: $full-width;

                #game-canvas {
                    background-color: rgb(245, 245, 245);
                    width: $canvas-width;
                    height: $canvas-height;
                }
            }

            .project-dirs-container {
                width: $full-width;
                height: calc(100vh - #{$canvas-height + 5px});
                background-color: rgb(12, 12, 12);
            }
        }

        .col-left {
            float: left;
            width: calc(#{$full-width} - #{$canvas-width});
        }
    }
</style>