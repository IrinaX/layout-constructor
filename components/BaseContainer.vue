<template>
    <div>
        <div class="base-component"
             :class="{'base-component_active':d_isActive,'dot_active':d_move.active}"
             :style="c_style"
             @mousedown="onTranslateDown"
        >
            <slot />
            <div v-if="d_isActive">
                <div v-for="index in 4"
                     :key="index"
                     class="base-component__dot"
                     @mousedown.stop="onResizeDown($event, index)"
                />
            </div>
            <div v-if="d_isActive"
                 class="base-component__rotate-btn"
                 :class="{'dot_active':d_rotate.active}"
                 @mousedown.stop="onRotateDown($event)"
            />
            <div v-if="d_isActive"
                 ref="origin"
                 class="base-component__origin-dot"
            />
        </div>
        <div v-if="d_isActive"
             class="base-component-menu"
        >
            <!--
                В этот слот пробрасываются кнопки, индивидуальные для каждого компонента. Например, шрифт, размер шрифта, начертание, цвет.
            -->
            <slot name="menu" />

            <!--
                Здесь мы размещаем те кнопки, которые будут общие у всех компонентов.
                Например. можно сделать кнопки "На передний план", "На задний план", "Удалить".
            -->

            <div class="toolbar__layers">
                <button type="button"
                        class="base-component-menu__btn"
                        title="Расположение слоев"
                        @click="openDropdown()"
                >
                    <i class="uil uil-layer-group" />
                </button>
                <div v-if="currDropDown === 'layers'"
                     class="toolbar__dropdown"
                >
                    <ul>
                        <li>
                            <button type="button"
                                    class="toolbar__dropdown-btn"
                                    title="На передний план"
                                    @click="editor.bringFront(id)"
                            >
                                <i class="uil uil-bring-bottom" />
                            </button>
                            <button type="button"
                                    class="toolbar__dropdown-btn"
                                    title="На задний план"
                                    @click="editor.bringBack(id)"
                            >
                                <i class="uil uil-bring-front" />
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <button type="button"
                    class="base-component-menu__btn"
                    title="Удалить"
                    @click="editor.remove(id)"
            >
                <i class="uil uil-trash-alt" />
            </button>
            <!--            <button type="button"-->
            <!--                    class="base-component-menu__btn"-->
            <!--                    title="Пример кнопки которая будет в меню у всех компонентов"-->
            <!--            >-->
            <!--                <i class="uil uil-question-circle" />-->
            <!--            </button>-->
        </div>
        <div v-if="d_isActive"
             class="debug-info"
             v-html="JSON.stringify(d_params, null, 2)"
        />
    </div>
</template>

<script>
import Point from '~/assets/js/point';

window.Point = Point;
export default {
    name: 'BaseContainer',
    props: {
        currDropDown: {
            type: String,
            default: 'nope',
        },
        editor: {
            type: Object,
            default() {
                return {};
            },
        },
        id: {
            type: String,
            default: '',
        },
        movable: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            d_isActive: false,
            d_resize: {
                active: false,
                resizing: false, // фиксит Баг2
                activeDotIndex: null,
            },
            d_rotate: {
                active: false,
            },
            d_move: {
                active: false,
                moving: false, // фиксит Баг2
            },
            d_params: {
                screenOrigin: new Point(125, 125),
                position: new Point(),
                size: new Point(250, 250),
                // document.querySelector('.base-component_active').closest('div').clientHeight
                angle: 0,
            },
            d_clonedParams: null,
            d_touchDownCoords: null,
        };
    },
    computed: {
        c_style() {
            return {
                transform: `rotate(${this.d_params.angle}rad) translate(${this.d_params.position.x}px, ${this.d_params.position.y}px)`,
                transformOrigin: `${this.d_params.screenOrigin.x}px ${this.d_params.screenOrigin.y}px`,
                width: `${this.d_params.size.x}px`,
                height: `${this.d_params.size.y}px`,
            };
        },
    },
    watch: {
        /**
         * При потере фокуса на элементе убираем с него все листенеры
         */
        d_isActive(val) {
            if (val) {
                this.$emit('focus');

                document.body.addEventListener('mousedown', this.onBodyTouchDown);
                document.body.addEventListener('keydown', this.onKeyDelete);
            } else {
                this.$emit('blur');
                document.body.removeEventListener('keydown', this.onKeyDelete);
                document.body.removeEventListener('click', this.onBodyTouchDown);
                document.body.removeEventListener('mousemove', this.onRotateMove);
                document.body.removeEventListener('mouseup', this.onRotateUp);
                document.body.removeEventListener('mousemove', this.onTranslateMove);
                document.body.removeEventListener('mouseup', this.onTranslateUp);
                document.body.removeEventListener('mousemove', this.onResizeMove);
                document.body.removeEventListener('mouseup', this.onResizeUp);
            }
        },
        /**
         * Вотчеры снизу отлавливают начало перемещения, ресайза и вращения и задают соответствующие листенеры в Body.
         * При завершении действия листенеры удаляются из Body.
         * (изменение через CSS активной точки на огромный размер сейчас уже можно убрать)
         */
        'd_rotate.active'(val) {
            if (val) {
                document.body.addEventListener('mousemove', this.onRotateMove);
                document.body.addEventListener('mouseup', this.onRotateUp);
            } else {
                document.body.removeEventListener('mousemove', this.onRotateMove);
                document.body.removeEventListener('mouseup', this.onRotateUp);
            }
        },
        'd_move.active'(val) {
            if (val) {
                document.body.addEventListener('mousemove', this.onTranslateMove);
                document.body.addEventListener('mouseup', this.onTranslateUp);
            } else {
                document.body.removeEventListener('mousemove', this.onTranslateMove);
                document.body.removeEventListener('mouseup', this.onTranslateUp);
            }
        },
        'd_resize.active'(val) {
            if (val) {
                document.body.addEventListener('mousemove', this.onResizeMove);
                document.body.addEventListener('mouseup', this.onResizeUp);
            } else {
                document.body.removeEventListener('mousemove', this.onResizeMove);
                document.body.removeEventListener('mouseup', this.onResizeUp);
            }
        },
    },
    mounted() {
        // выключаем нативный DragAndDrop
        this.$el.ondragstart = () => {
            return false;
        };
        // присвоение компоненту изначальный размер картинки/текста (на тексте работает, на изображении нет)
        // let x = Number(getComputedStyle(this.$el.children[0].children[0]).width.replace('px',''));
        // let y = Number(getComputedStyle(this.$el.children[0].children[0]).height.replace('px',''));
        // this.d_params.size = new Point(x,y);
        // this.d_params.screenOrigin=new Point (x/2,y/2);
        // console.log('done');
    },
    /**
     * Перед удалением компонента снимаем с него фокус. Тем самым сработает вотчер и уберет все листенеры с Body.
     * */
    beforeDestroy() {
        this.d_isActive = false;
    },
    methods: {
        onKeyDelete(event) {
            if (event.keyCode === 46) {
                this.editor.remove(this.id);
                // console.log(this.id);
            }
        },
        openDropdown() {
            let currDropDown = this.currDropDown;
            currDropDown = currDropDown !== 'layers' ? 'layers' : 'nope';
            this.$emit('openingDropdown', currDropDown);
        },
        /*
        * Баг1: если кликнуть на компонент не основной кнопкой, когда компонент повернут, то position: null, null.
        * Пофикшен.
        * */
        onTranslateDown(event) {
            this.d_touchDownCoords = new Point(event.pageX, event.pageY);
            if (isNaN(this.d_params.position.x) || isNaN(this.d_params.position.y)) { // фиксит Баг1
                this.d_params.position = this.d_clonedParams.position;
            }
            this.cloneParams();
            this.d_isActive = true;
            this.d_move.active = this.movable;
        },
        onTranslateMove(event) {
            /*
            * Баг2: если повернуть компонент и кликнуть по нему пару раз, то position: null null.
            * При клике ф-я onTranslateMove не срабатывает, и функция this.calcParams() искажает координаты position.
            * Пофиксила след. образом:
            * Добавила булеву переменную d_move.moving. Теперь, во время клика будет срабатывать проверка в фунции onTranslateUp:
            * если d_move.moving истина то вызываем функцию calcParams.
            * */
            this.d_move.moving = true;// фиксит Баг2
            if (this.d_move.active) {
                const A = new Point(event.pageX, event.pageY);
                const B = new Point(this.d_touchDownCoords);
                const screenDif = A.sub(B);
                const localDif = this.screenToLocal(screenDif);
                this.d_params.position.x = this.d_clonedParams.position.x + localDif.x;
                this.d_params.position.y = this.d_clonedParams.position.y + localDif.y;
            }
        },
        onTranslateUp(event) {
            this.d_move.active = false;
            if (this.d_move.moving) { // фиксит Баг2
                this.calcParams();
            }
            this.d_move.moving = false;// фиксит Баг2
        },

        onResizeDown(event, index) {
            this.d_touchDownCoords = new Point(event.pageX, event.pageY);
            if (isNaN(this.d_params.size.x) || isNaN(this.d_params.size.y)) { // фиксит Баг1
                this.d_params.size = this.d_clonedParams.size;
            }
            if (isNaN(this.d_params.position.x) || isNaN(this.d_params.position.y)) { // фиксит Баг1
                this.d_params.position = this.d_clonedParams.position;
            }
            this.cloneParams();
            event.target.classList.toggle('dot_active', true);
            this.d_resize.activeDotIndex = index;
            this.d_resize.active = true;
        },
        onResizeMove(event) {
            /*
            * Баг3: если повернуть компонент и кликнуть пару раз по маркеру ресайза, то position: null null.
            * Пофиксила так же, как и onTranslateMove.
            * */
            this.d_resize.resizing = true;// фиксит баг3
            if (this.d_resize.active) {
                const AA = this.d_touchDownCoords;
                const BB = new Point(event.pageX, event.pageY);

                const a0 = BB.y - AA.y;
                // const b0 = BB.x - AA.x;

                const c = Math.sqrt((BB.x - AA.x) * (BB.x - AA.x) + (BB.y - AA.y) * (BB.y - AA.y));

                const A0 = Math.asin(a0 / c);

                const directionX = AA.x < BB.x ? 1 : -1;

                const A = this.d_params.angle - directionX * A0;

                const a = directionX * c * Math.sin(A);
                const b = directionX * c * Math.cos(A);

                // sizeX sizeY positionX positionY
                let values = [0, 0, 0, 0];
                switch (this.d_resize.activeDotIndex) {
                case 1:
                    values = [-b, a, b, -a];
                    break;
                case 2:
                    values = [b, a, 0, -a];
                    break;
                case 3:
                    values = [b, -a, 0, 0];
                    break;
                case 4:
                    values = [-b, -a, b, 0];
                    break;
                }
                // if (this.d_clonedParams.size.x + values[0] < 21) { //todo: выставить минимальный размер изображения, убрать перемещение при минимальном размере по осям
                //     this.d_params.size.x = 20;
                // } else if (this.d_clonedParams.size.y + values[1] < 21) {
                //     this.d_params.size.y = 20;
                // } else {
                this.d_params.size.x = this.d_clonedParams.size.x + values[0];
                this.d_params.size.y = this.d_clonedParams.size.y + values[1];
                // }
                this.d_params.position.x = this.d_clonedParams.position.x + values[2];
                this.d_params.position.y = this.d_clonedParams.position.y + values[3];
            }
        },
        onResizeUp(event) {
            event.target.classList.toggle('dot_active', false);
            this.d_resize.active = false;
            if (this.d_resize.resizing) { // фиксит баг3
                this.calcParams();
            }
            this.d_resize.resizing = false;// фиксит баг3
        },

        onRotateDown(event) {
            this.d_touchDownCoords = new Point(event.pageX, event.pageY);
            if (isNaN(this.d_params.position.x) || isNaN(this.d_params.position.y)) { // фиксит Баг1
                this.d_params.position = this.d_clonedParams.position;
            }
            this.cloneParams();
            this.d_rotate.active = true;
        },
        onRotateMove(event) {
            if (this.d_rotate.active) {
                const o = new Point(
                    this.d_params.screenOrigin.x,
                    this.d_params.screenOrigin.y,
                );
                const b = new Point(
                    event.pageX,
                    event.pageY,
                );
                let angle = b.angle(o) - Math.PI * 0.5;
                if (b.x < o.x) {
                    angle += Math.PI;
                }
                this.d_params.angle = angle;
            }
        },
        onRotateUp(event) {
            this.d_rotate.active = false;
        },

        /**
         * Вычисляем новый transform origin.
         * Здесь используется функция getBoundingClientRect - получение координат DOM элемента origin на экране.
         * Не очень хороший способ, но другого пока нет...
         * */
        calcParams() {
            if (!this.$refs.origin) {
                return;
            }
            // const old = this.d_params.screenOrigin;
            const originRect = this.$refs.origin.getBoundingClientRect();
            const A = new Point(
                originRect.x + 7,
                originRect.y + 7,
            );
            this.d_params.screenOrigin = A;

            // Код ниже нужен для компенсации скачка при изменении origin
            if (this.d_params.angle) {
                this.$nextTick(() => {
                    const originRect2 = this.$refs.origin.getBoundingClientRect();
                    const B = new Point(
                        originRect2.x + 7,
                        originRect2.y + 7,
                    );
                    const screenDif = B.sub(A);
                    const localDif = this.screenToLocal(screenDif);
                    this.d_params.position = this.d_params.position.add(localDif.mul(new Point(-1, -1)));
                });
            }
        },
        /**
         * Клонируем все параметры в отдельную переменную
         * */
        cloneParams() {
            this.d_clonedParams = {
                position: new Point(this.d_params.position),
                size: new Point(this.d_params.size),
                angle: this.d_params.angle,
                screenOrigin: new Point(this.d_params.screenOrigin),
            };
        },
        /**
         * Убираем фокус с элемента при клике на Body, при условии, что под кликнутым местом нет текущего элемента
         * */
        onBodyTouchDown(event) {
            if (!event.path.includes(this.$el)) {
                this.d_isActive = false;
            }
        },
        /**
         * Эта функция преобразует экранные X,Y в систему координат повернутой фигуры"
         * */
        screenToLocal(point) {
            const nullPoint = new Point(0, 0);
            point = new Point(point);
            if (this.d_clonedParams.angle === 0) {
                return point;
            }
            const c = point.len(nullPoint);
            const directionX = point.x >= 0 ? -1 : 1;
            const directionY = point.x >= 0 ? 1 : -1;
            const angle = this.d_clonedParams.angle + (Math.PI * 0.5 - point.angle(nullPoint));
            return new Point(
                -c * Math.sin(angle) * directionX,
                c * Math.cos(angle) * directionY,
            );
        },
    },
};
</script>

<style scoped lang="scss">
@import "assets/sass/variables";
.base-component-menu {
    background: white;
    border: 1px solid #d2d2d2;
    bottom: 85px;
    left: 15px;
    border-radius: 20px;
    box-shadow: 0 6px 20px #606a75;
    /*box-shadow: 0 6px 20px #aed5ff;*/
    position: fixed;
    z-index: 1000;
    display: flex;
    flex-direction: column;
}

.base-component-menu__btn {
    border: none;
    background: none;
    height: 50px;
    display: block;
    width: 50px;
    color: #6f6f6f;
    font-size: 20px;
    cursor: pointer;

    &:hover {
        color: $secondary;
    }

    &:focus {
        outline: none;
    }
}

.debug-info {
    display: none;
    white-space: pre-wrap;
    font-size: 12px;
    line-height: 14px;
    position: fixed;
    bottom: 7px;
    right: 7px;
}

.base-component {
    display: inline-block;
    border: 2px solid transparent;
    margin: -2px 0 0 -2px;
    position: absolute;
    top: 0;
    left: 0;
    user-select: none;
    box-sizing: content-box;
}

.base-component_active {
    border: 2px solid $secondary;

    &.dot_active {
        /* &:before {
             background: transparent;
             content: "";
             position: absolute;
             width: 900000px;
             height: 900000px;
             left: -450000px;
             top: -450000px;
         }*/
    }
}
.base-component__dot {
    position: absolute;
    width: 10px;
    height: 10px;
    background: white;
    border: 1px solid $secondary;
    //border-radius: 50%;
    cursor: nwse-resize;

    &.dot_active {
        background:$secondary;
    }

    &:nth-child(1) {
        top: -8px;
        left: -8px;
    }

    &:nth-child(2) {
        top: -8px;
        right: -8px;
    }

    &:nth-child(3) {
        bottom: -8px;
        right: -8px;
    }

    &:nth-child(4) {
        bottom: -8px;
        left: -8px;
    }
}

.base-component__rotate-btn {
    z-index: 9000;
    width: 15px;
    height: 15px;
    position: absolute;
    bottom: -50px;
    left: 50%;
    margin-left: -5px;
    background: $secondary;
    border: 1px solid rgba($secondary,.8);
    border-radius: 50%;

    &.dot_active {
        background: rgba($secondary,.5);

        /* &:before {
             z-index: 9000;
             background: transparent;
             content: "";
             position: absolute;
             width: 900000px;
             height: 900000px;
             left: -450000px;
             top: -450000px;
         }*/
    }
}

.base-component__origin-dot {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 10px;
    height: 10px;
    //background: white;
    background: transparent;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -5px;
}

.toolbar__layers {
    position: relative;
}

.base-component-menu__btn {
    display: flex;
    align-items: center;
    justify-content: center;
}

.toolbar__dropdown {
    background: white;
    border: 1px solid #d2d2d2;
    top: 0;
    left: 65px;
    border-radius: 20px;
    /*box-shadow: 0 6px 20px #aed5ff;*/
    box-shadow: 0 6px 20px #606a75;
    position: absolute;
    text-align: center;
    overflow: hidden;

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        /*height: 400px;*/
        overflow: hidden;

        li {
            padding: 0;

            .toolbar__dropdown-btn {
                padding: 6px 20px;
                border: none;
                outline: none;
                background: none;
                display: block;
                width: 100%;
                color: #6f6f6f;
                cursor: pointer;

                &:hover {
                    color: black;
                    background: rgba(#6f6f6f, .5);
                }
            }

            .active {
                color: black;
                background: rgba(#6f6f6f, .5);
            }
        }
    }
}

</style>
