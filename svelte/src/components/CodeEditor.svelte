<script>
    import { onMount } from "svelte";
    import { codeEditorContents, isEditorOpened } from "../states";
    
    let textArea;
    let editor;

    function updateTextArea(contents) {
        editor.getDoc().setValue(contents);
    }

    function closeEditor(event) {
        isEditorOpened.set(false);
    }

    onMount(() => {
        editor = CodeMirror.fromTextArea(textArea, {
            lineNumbers: true,
            mode: "javascript",
        });
        console.log("modes", CodeMirror.modes);
        console.log("editor obj", editor);

        codeEditorContents.subscribe(updateTextArea);
    });
</script>

<div class="code-container">
    <div class="action-bar">
        <button class="action-btn alert" on:click={closeEditor}>&times;</button>
        <button class="action-btn primary">run</button>
        <button class="action-btn secondary">save</button>
    </div>
    <textarea bind:this={textArea}></textarea>
</div>

<style lang="scss">
    @import "./../variables.scss";
    $action-bar-height: 40px;

    textarea {
        width: 100%;
        height: cacl(#{$full}- #{$action-bar-height});
    }
    .code-container{
        .action-bar {
            height: $action-bar-height;
            width: $full;
            position: absolute;
            top:0;
            right: 0;
            left: 0;
            display: flex;
            justify-content: left;
            align-items: center;
            background-color: rgb(245, 245, 245);

            button {
                margin-top: 8px;
                margin-left: 1px;
                margin-right: 1px;
                outline: none;
                border: 0;
                cursor: pointer;

                &.action-btn{
                    padding: 4px 8px;

                    &.primary{
                        background-color: rgb(15, 96, 189);
                        color: white;
                    }

                    &.secondary{
                        background-color: rgb(48, 48, 48);
                        color: rgb(255, 255, 255);
                    }

                    &.alert {
                        background-color: rgb(172, 30, 30);
                        color:rgb(255, 255, 255);
                    }
                }   
            }
        }
    }
</style>