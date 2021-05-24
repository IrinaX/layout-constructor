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
    data() {
        return {
            i: 0,
        };
    },
    methods: {
        handleClick() {
            /*
                * remove i in data, "if (this.i<text.length)","this.i++;", change "text: text[this.i]" to "text: text"
                * replace "const text = ['urls']" with "const text = window.prompt('img text');"
                * */
            const text = [
                'Новый текст.',
                'Привет Мир!',
                'Безумно можно быть пееервым',
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab beatae commodi cum debitis dicta ' +
                    'dolor facilis magni molestias natus, nisi odio provident quae, quas reprehenderit tempore unde, ' +
                    'veniam voluptatem!',
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab beatae commodi cum debitis dicta ' +
                    'dolor facilis magni molestias natus, nisi odio provident quae, quas reprehenderit tempore unde, ' +
                    'veniam voluptatem!',
            ];

            if (this.i < text.length) {
                this.editor.place({
                    name: 'TextComponent',
                    props: {
                        editor: this.editor,
                        text: text[this.i],
                        active: false,
                    },
                });
                this.i++;
            }
        },
    },
};
</script>
<style scoped>
</style>
