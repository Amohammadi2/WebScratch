<script>
    import { fly } from "svelte/transition";

    export let msg;
    export let type;
    export const pk = undefined;

    let backgrounds = {
        alert: "red",
        success: "green",
        info: "white",
    };

    let colors = {
        alert: "white",
        success: "white",
        info: "black",
    }

</script>

<div class="notification" on:click transition:fly={{x: 300, duration: 200}}
style={
    `
    background-color: ${backgrounds[type] || "white"};
    color: ${colors[type] || "black"}
    `
}>
    {msg}
</div>


<style lang="scss">
    .notification {
        margin: 10px 0px;
        padding: 7px 5px;
        border-radius: 3px;
        cursor: pointer;
    }
</style>