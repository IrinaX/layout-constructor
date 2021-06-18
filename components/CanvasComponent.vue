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
        <!--        <div class="menu">-->
        <!--            <button class="menu__btn"-->
        <!--                    type="button"-->
        <!--            >-->
        <!--                <i class="uil uil-save" />-->
        <!--            </button>-->
        <!--            <button class="menu__btn"-->
        <!--                    type="button"-->
        <!--            >-->
        <!--                <i class="uil uil-folder-open" />-->
        <!--            </button>-->
        <!--            <button class="menu__btn"-->
        <!--                    type="button"-->
        <!--            >-->
        <!--                &lt;!&ndash;                 @click="editor.scaleFactor+=0.1"&ndash;&gt;-->
        <!--                <i class="uil uil-search-plus" />-->
        <!--            </button>-->
        <!--            <button class="menu__btn"-->
        <!--                    type="button"-->
        <!--            >-->
        <!--                &lt;!&ndash;                @click="editor.scaleFactor-=0.1"&ndash;&gt;-->
        <!--                <i class="uil uil-search-minus" />-->
        <!--            </button>-->
        <!--        </div>-->
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
                this.editor.components.forEach((item) => {
                    item.props.active = false;
                });
            }
        });
    },
    methods: {
        handleComponentPlacing(component) {
            // this.$refs.content.appendChild(component.$el);
        },
        handleClick(component, arr) {
            arr.forEach((item) => {
                item.props.active = false;
            });
            component.props.active = !component.props.active;
        },
    },
};
</script>

<style scoped lang="scss">
.content {
    position: relative;
    overflow: hidden;
    background: repeating-linear-gradient(
            transparent, transparent 0.48cm, #e2e2e2 0.50cm, transparent 0.52cm
    ),
    repeating-linear-gradient(
            90deg,
            transparent, transparent 0.48cm, #e2e2e2 0.50cm, transparent 0.52cm
    );
}

.workarea {
    //width: 9cm;
    //height: 5cm;
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*right: 0;*/
    /*bottom: 0;*/
    /*margin: auto;*/
    //box-shadow: 0 0 0 10000px #00000059;
}

.menu {
    background: white;
    border: 1px solid #d2d2d2;
    top: 15px;
    right: 15px;
    border-radius: 20px;
    /*box-shadow: 0 6px 20px #aed5ff;*/
    box-shadow: 0 6px 20px #606a75;
    position: absolute;
    z-index: 1000;
    display: flex;
    flex-direction: column;

    .menu__btn {
        border: none;
        background: none;
        height: 50px;
        display: block;
        width: 50px;
        color: #6f6f6f;
        font-size: 20px;
        cursor: pointer;

        &:hover {
            color: #6253e2;
        }

        &:focus {
            outline: none;
        }
    }
}
</style>
