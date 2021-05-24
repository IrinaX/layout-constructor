<template>
    <div ref="content"
         class="content"
    >
        <div class="workarea">
            <!--             :style="c_style"-->

            <component :is="component.name"
                       v-for="(component) in editor.components"
                       :key="component.props.id"
                       v-bind="component.props"
            />
        </div>
        <div class="menu">
            <button class="menu__btn"
                    type="button"
            >
                <i class="uil uil-save" />
            </button>
            <button class="menu__btn"
                    type="button"
            >
                <i class="uil uil-folder-open" />
            </button>
            <button class="menu__btn"
                    type="button"
            >
                <!--                 @click="editor.scaleFactor+=0.1"-->
                <i class="uil uil-search-plus" />
            </button>
            <button class="menu__btn"
                    type="button"
            >
                <!--                @click="editor.scaleFactor-=0.1"-->
                <i class="uil uil-search-minus" />
            </button>
        </div>
    </div>
</template>

<script>
import Point from '~/assets/js/point';
export default {
    name: 'CanvasComponent',
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
            d_size: new Point(9, 5),
        };
    },
    computed: {
        c_style() {
            return {
                width: this.d_size.x * this.editor.scaleFactor + 'cm',
                height: this.d_size.y * this.editor.scaleFactor + 'cm',
            };
        },
    },
    mounted() {
        this.editor.subscribeToPlace(this.handleComponentPlacing);

        document.addEventListener('click', (e) => {
            // console.log([e.pageX, e.pageY]);
            if (e.target === this.$refs.content) {
                this.editor.components.forEach((item) => { item.props.active = false; });
            }
        });
    },
    methods: {
        handleComponentPlacing(component) {
            // this.$refs.content.appendChild(component.$el);
        },
        handleClick(component, arr) {
            arr.forEach((item) => { item.props.active = false; });
            component.props.active = !component.props.active;
        },
    },
};
</script>

<style scoped>

</style>
