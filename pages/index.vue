<template>
    <div class="app">
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

<style scoped lang="scss">
.app {
    display: flex;
    min-height: 100vh;
    align-items: stretch;
}

.content {
    width: 100%;
    padding: 15px;
}
</style>
