<template>
    <button type="button"
            @click="handleClick"
    >
        <i class="uil uil-image" />
    </button>
</template>
<script>
export default {
    name: 'ImgBtn',
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
        /*   handleClick() {
                const imgComponentConstructor = Vue.extend(ImgComponent);
                const imgComponentInstance = new imgComponentConstructor({
                    propsData: {
                        editor: this.editor,
                        src: 'https://www.meme-arsenal.com/memes/e0640caa49009147a3d3ca3a99b65c3d.jpg',
                    }
                });
                this.editor.place(imgComponentInstance)
            }, */
        handleClick() {
            /*
                * remove i in data, "if (this.i<src.length)","this.i++;", change "src: src[this.i]" to "src: src"
                * replace "const src = ['urls']" with "const src = window.prompt('img src');"
                * */
            /* const src = [
                'https://i.pinimg.com/736x/98/b9/52/98b952001792e2b836669abf4d853712.jpg',
                'https://i.pinimg.com/736x/ab/b6/a8/abb6a800ab2193fcedd9bda566b7402c.jpg',
                'https://lifeglobe.net/x/entry/9559/1a.jpg',
                'https://12millionov.com/wp-content/uploads/2017/10/%D0%A7%D0%B8%D0%BD%D0%BA%D0%B2%D0%B5-%D0%A2%D0%B5%D1%80%D1%80%D0%B5.jpeg',
                'https://bipbap.ru/wp-content/uploads/2017/06/91379067_Birjuzovoeozero600x300__1_.jpg',
                'https://lifeglobe.net/x/entry/7821/1a.jpg',
                'https://cs13.pikabu.ru/images/big_size_comm/2020-04_5/1587699265120062041.jpg',
                'https://i.ytimg.com/vi/KCz1FOeCOq8/maxresdefault.jpg',
            ];
            if (this.i < src.length) {
                this.editor.place({
                    name: 'ImgComponent',
                    props: {
                        editor: this.editor,
                        src: src[this.i],
                        active: false,
                    },
                });
                this.i++;
            } */
            const src = 'https://picsum.photos/1400/800?random=' + this.i;

            this.editor.place({
                name: 'ImgComponent',
                props: {
                    editor: this.editor,
                    src,
                    active: false,
                },
            });
            this.i++;
        },
    },
};
</script>
<style scoped>
</style>
