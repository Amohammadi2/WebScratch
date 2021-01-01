<script>
    import { onMount } from "svelte";
    import { codeEditorContents, isEditorOpened } from "../states";
    import { NotificationAPI, SystemFile } from "../utils";
    
    let textArea;
    let editor;

    let path, name, content;

    function updateTextArea(contents) {
        if (!contents) return;
        let [file_contents, file_path, file_name] = contents;
        path = file_path;
        name = file_name;
        content = file_contents
        editor.getDoc().setValue(file_contents);
    }

    function closeEditor(event) {
        let currentValue = editor.getDoc().getValue();
        let previousValue = content;
        console.log("current", currentValue);
        console.log("pre: ", previousValue);
        let message = "you haven't saved the file. do you want to close it anyway";
        if (currentValue == previousValue || confirm(message))
            isEditorOpened.set(false);
    }

    function saveContents() {
        let file = new SystemFile(path);
        let newContent = editor.getDoc().getValue();
        file.write(newContent);
        content = newContent;
        NotificationAPI.add("file saved successfuly", "success")
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
        <button class="action-btn secondary" on:click={saveContents}>save</button>
        <span class="action-btn" style="margin-left: 10px;">{name}</span>
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
                    transition: all .09s ease-in;

                    &.primary{
                        background-color: rgb(26, 117, 221);
                        color: white;

                        &:active {
                            background-color: rgb(18, 79, 148);
                        }

                        &:hover {
                            box-shadow: 0px 0px 3px rgb(29, 130, 245);
                        }
                    }

                    &.secondary{
                        background-color: rgb(63, 63, 63);
                        color: rgb(255, 255, 255);

                        &:active {
                            background-color: rgb(22, 22, 22);
                        }

                        &:hover {
                            box-shadow: 0px 0px 3px rgb(75, 75, 75);
                        }
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