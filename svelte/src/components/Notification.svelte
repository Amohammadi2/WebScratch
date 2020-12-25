<script>
    export let msg;
    export let type;

    let colorCodes = {
        "alert": "red",
        "success": "green",
        "info": "white"
    };

</script>

<div class="notification" style={`background-color: ${colorCodes[type] || "white"};`}>
    {msg}
</div>