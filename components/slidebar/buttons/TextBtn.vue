<template>
    <button type="button"
            @click="handleClick"
    >
        <i class="uil uil-text" />
    </button>
</template>
<script>
export default {
    name: 'TextBtn',
    props: {
        editor: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    methods: {
        handleClick() {
            /*
                * remove i in data, "if (this.i<text.length)","this.i++;", change "text: text[this.i]" to "text: text"
                * replace "const text = ['urls']" with "const text = window.prompt('img text');"
                * */

            this.editor.place({
                name: 'TextComponent',
                props: {
                    editor: this.editor,
                    text: 'Новый текст.',
                    active: false,
                },
            });
        },
    },
};
</script>
<style scoped>
</style>
