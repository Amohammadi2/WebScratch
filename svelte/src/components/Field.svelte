<script>
    export let label;
</script>

<div class="field">
    <label for>{label}</label>
    <slot></slot>
</div>

<style lang="scss">
    .field {
        box-sizing: border-box;
        padding: 3px 10px;
        
        label::after {
            content: " : ";
        }
    }
</style>