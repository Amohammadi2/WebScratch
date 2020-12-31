<script>
    export let title;
</script>

<div class="property">
    <div class="title">{title}</div>
    <slot></slot>
</div>

<style lang="scss">
    .property {
        width: 100;
        background-color: rgb(235, 235, 235);

        .title {
            box-sizing: border-box;
            padding: 5px 8px;
            margin: 0;
            background-color: rgb(24, 24, 24);
            color: white;
        }
    }
</style>