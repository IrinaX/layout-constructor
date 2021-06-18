<template>
    <base-container :id="id"
                    :curr-drop-down="d_currDropdown"
                    :editor="editor"
                    @remove="$emit('remove')"
                    @openingDropdown="openDropDown"
    >
        <img :src="src"
             alt=""
             style="width: 100%;height: 100%;"
        >
    </base-container>
</template>

<script>
import BaseContainer from '~/components/BaseContainer';

export default {
    name: 'ImgComponent',
    components: { BaseContainer },
    props: {
        editor: {
            type: Object,
            default() {
                return {};
            },
        },
        src: {
            type: String,
            default: '',
        },
        id: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            d_currDropdown: 'nope',
            d_src: this.src || null,
        };
    },
    methods: {
        openDropDown(currDropDown) {
            this.d_currDropdown = currDropDown;
        },
    },
};
</script>

<style scoped>

</style>
