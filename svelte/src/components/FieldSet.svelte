<script>
    export let groupName
</script>

<fieldset class="fields-group">
    <legend class="group-name">{groupName}</legend>
    <slot></slot>
</fieldset>

<style lang="scss">
    .fields-group {
        padding: 2px 5px;
        margin: 5px 8px;
        box-sizing: border-box;

        .group-name {
            margin-left: 20px;
        }
    }
</style>