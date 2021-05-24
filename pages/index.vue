<template>
    <div>
        <slidebar-component :editor="d_editor" />
        <canvas-component :editor="d_editor" />
    </div>
</template>

<script>
import CanvasComponent from '~/components/CanvasComponent';
import SlidebarComponent from '~/components/slidebar/SidebarComponent';
import LayoutConstructor from '~/assets/js/layoutConstructor';
export default {
    components: { CanvasComponent, SlidebarComponent },
    data() {
        return {
            // LayoutConstructor - класс, который нужно реализовать
            d_editor: new LayoutConstructor(),
        };
    },
    methods: {},
};
</script>

<style>
</style>
