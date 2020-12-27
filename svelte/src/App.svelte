<script>
    import { onMount } from "svelte";
    import { flip } from "svelte/animate";
    import { notifications, gameComponents} from "./states";
    import { GameObject } from "./utils";
    import ProjectDirectory from "./components/ProjectDirectory.svelte";
    import CodeEditor from "./components/CodeEditor.svelte";
    import EditorWindow from "./components/EditorWindow.svelte";
    import ComponentsEditor from "./components/ComponentsEditor.svelte";
    import ComponentCreator from "./components/ComponentCreator.svelte";
    import Notification from "./components/Notification.svelte";

    let gameCanvas;
    let isPhysicsEngineRunning = false;

    function closeNotification (pk) {
        notifications.update((value) => {
            return value.filter((val) => (val.pk != pk));
        });
    }

    function runPhysicsEngine() {
        
        isPhysicsEngineRunning = !isPhysicsEngineRunning;
        if (isPhysicsEngineRunning){
            Matter.Runner.run(EngineRunner, PhysicsEngine);
        }
        else {
            Matter.Runner.stop(EngineRunner);
        }
    }

    onMount(() => {
        console.log(gameCanvas);
        window.gm = gameComponents;
        window.GameObject = GameObject;
        window.PhysicsEngine = Matter.Engine.create();
        window.Render = Matter.Render.create({
            element: gameCanvas,
            engine: PhysicsEngine,
            options: {
                wireframes: false,
                background: "rgb(240, 240, 240)",
                width: 800,
                height: 500
            }
        });
        window.EngineRunner = Matter.Runner.create();

        window.onresize = function resizeCanvas() {
            Render.canvas.width = 650;
            Render.canvas.height = document.documentElement.clientHeight;
            console.log("canvas resized to fit the screen");

            return resizeCanvas;
        }();

        let cons = Matter.MouseConstraint.create(PhysicsEngine, {
            mouse: Matter.Mouse.create(Render.canvas),
            constraint: {
                stiffness: 0.1,
                render: {
                    visible: false,
                }
            }
        });

        let ground = Matter.Bodies.rectangle(325,600, 650,50, {
            isStatic: true
        });
        let player = Matter.Bodies.rectangle(50,100, 50, 50);

        Matter.World.add(PhysicsEngine.world, [cons, ground, player]);

        Matter.Render.run(Render);
    });
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
        <button class={isPhysicsEngineRunning && "active"} id="play-btn" on:click={runPhysicsEngine}>
            play
        </button>
        <div class="game-canvas-container" bind:this={gameCanvas}></div>
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
            position: relative;
            
            .game-canvas-container {
                width: $full;
                height: $canvas-height;
                margin: 0; padding: 0;
            }

            #play-btn {
                position: absolute;
                top: 20px;
                right: 20px;

                &.active {
                    background-color: rgb(0, 233, 97);
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