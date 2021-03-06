<script>
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { flip } from "svelte/animate";
    import {
        notifications,
        gameComponents,
        isPhysicsEngineRunning,
        projectFileName,
        CWDPath,
        pathDelimiter,
    } from "./states";
    import { Dialogs, GameObject, NotificationAPI, SystemFile} from "./utils";
    import ProjectDirectory from "./components/ProjectDirectory.svelte";
    import CodeEditor from "./components/CodeEditor.svelte";
    import EditorWindow from "./components/EditorWindow.svelte";
    import ComponentsEditor from "./components/ComponentsEditor.svelte";
    import ComponentCreator from "./components/ComponentCreator.svelte";
    import Notification from "./components/Notification.svelte";
    import ComponentProperties from "./components/ComponentProperties.svelte";

    let gameCanvas;
    let isFirstRun = true;

    function closeNotification (pk) {
        notifications.update((value) => {
            return value.filter((val) => (val.pk != pk));
        });
    }

    function loadScripts() {
        for (let gc of $gameComponents) {
            gc.setupScripts(isFirstRun);
        }
    }

    function runPhysicsEngine() {
        isPhysicsEngineRunning.set(!($isPhysicsEngineRunning));
        if ($isPhysicsEngineRunning){
            Matter.Runner.run(EngineRunner, PhysicsEngine);
            loadScripts();
        }
        else {
            Matter.Runner.stop(EngineRunner);
            isFirstRun = false;
        }
    }

    function initComponents() {
        if (!$CWDPath) return;
        let file = new SystemFile($CWDPath + pathDelimiter + projectFileName);
        for (let stats of file.readJSON()) {
            if (stats.mode == "body") {
                let component = new GameObject
                    (stats.mode, stats.type, stats.x, stats.y, stats.width, stats.height, stats.options);
                component.scripts.set(stats.scripts);
                gameComponents.update(components => [...components, component]);
                component.create();
                component.add(); // add to the world
                console.log($gameComponents);
            }
        }
    }

    function initPhysicsEngine() {
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
        window.gm = GameObject;
    }

    function exposeInternalAPIs() {
        window.GameObject = GameObject;
        window.Dialogs = Dialogs;
    }

    function handleWindowResize() {
        window.onresize = function resizeCanvas() {
            Render.canvas.width = 650;
            Render.canvas.height = document.documentElement.clientHeight;
            console.log("canvas resized to fit the screen");

            return resizeCanvas;
        }();
    }

    function saveComponentsIntoFile() {
        if (!$CWDPath) {
            NotificationAPI.add("please open project directory first", "alert");
            return;
        }
        let file = new SystemFile($CWDPath + pathDelimiter + projectFileName);
        let stats = [];
        for (let gc of $gameComponents) {
            stats.push({
                mode: gc.mode,
                type: gc.type,
                x: gc.offset.x,
                y: gc.offset.y,
                width: gc.bounds.width,
                height: gc.bounds.height,
                xScale: gc.scale.xScale,
                yScale: gc.scale.yScale,
                scripts: get(gc.scripts),
                options: gc.options,
            });
        }
        file.writeJSON(stats);
        NotificationAPI.add("the scene saved successfuly", "success");
    }

    onMount(() => {
        exposeInternalAPIs();
        initPhysicsEngine();
        handleWindowResize();
        //loadComponents();
        initComponents();
        let _=true;
        isPhysicsEngineRunning.subscribe(isRunning => {
            if (!isRunning && !_) {
                for (let gc of $gameComponents) {
                    gc.reconstruct();
                }
            }
            else {
                _=false;
            }
        });
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
        <ComponentProperties />
    </div>
    <div class="col-middle">
        <ProjectDirectory />
        <ComponentsEditor />
    </div>
    <div class="col-right">
        <div class="canvas-bar">
            <button class="btn-bar primary {$isPhysicsEngineRunning && "active"}" on:click={runPhysicsEngine}>
                play
            </button>
            <button class="btn-bar secondary" on:click={saveComponentsIntoFile}>
                save
            </button>
        </div>
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

            .canvas-bar {
                position: absolute;
                top: 20px;
                right: 20px;
                .btn-bar {
                    cursor: pointer;
                    font-size: 12px;
                    padding: 4px 5px;
                    color: rgb(54, 54, 54);
                    transition: all .09s ease-out;

                    &.primary {
                        background-color: rgb(166, 227, 255);

                        &.active {
                            background-color: rgb(15, 114, 160);
                            color: white;
                        }
                    }

                    &.secondary {
                        background-color: rgb(247, 247, 247);

                        &:hover {
                            background-color: rgb(207, 207, 207);
                        }

                        &.active {
                            background-color: rgb(32, 32, 32);
                            color: white;
                        }
                    }
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
            height: 100vh;
            overflow-y: scroll;
            position: relative;
        }
    }
</style>