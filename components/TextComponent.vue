<template>
    <base-container
        :id="id"
        :curr-drop-down="d_currDropdown"
        :editor="editor"
        :movable="!d_contenteditable"
        @openingDropdown="openDropdown"
        @dblclick.native="d_contenteditable = true"
        @blur="d_contenteditable = false"
    >
        <editor-content class="textarea"
                        :editor="d_editor"
                        :style="c_style"
        />
        <!--        <div class="textarea"-->
        <!--             :style="c_style"-->
        <!--             :contenteditable="d_contenteditable"-->
        <!--        >{{text}}-->
        <!--        </div>-->
        <template #menu>
            <div class="toolbar__fc">
                <button type="button"
                        class="base-component-menu__btn"
                        :title="d_params.color.currValue"
                        @click="d_currDropdown = d_currDropdown!=='color' ? 'color' : 'nope'"
                >
                    <span class="color-icon"
                          :style="{ background: d_params.color.currValue}"
                    />
                </button>
                <div v-if="d_currDropdown === 'color'"
                     class="toolbar__dropdown"
                >
                    <div class="toolbar__dropdown-label">
                        Базовая палитра:
                    </div>
                    <div class="toolbar__dropdown-group">
                        <button v-for="color in d_params.color.baseValues"
                                :key="color.id"
                                type="button"
                                class="toolbar__dropdown-color-btn"
                                :style=" {background: color}"
                                :title="color"
                                @click="d_params.color.currValue = color"
                        />
                    </div>
                </div>
            </div>
            <div class="toolbar__fz">
                <button type="button"
                        class="base-component-menu__btn"
                        title="Размер шрифта"
                        @click="d_currDropdown = d_currDropdown!=='fontSize' ? 'fontSize' : 'nope'"
                        @keydown.enter="changeFontSize(Number(d_params.fontSize.currValue))"
                >
                    <input v-model="d_params.fontSize.currValue"
                           type="text"
                           class="input"
                           @keydown.up="changeFontSize(++d_params.fontSize.currValue)"
                           @keydown.down="changeFontSize(--d_params.fontSize.currValue)"
                    >
                </button>
                <div v-if="d_currDropdown === 'fontSize'"
                     class="toolbar__dropdown"
                >
                    <ul>
                        <li
                            v-for="value in d_params.fontSize.values"
                            :key="value.id"
                        >
                            <button type="button"
                                    class="toolbar__dropdown-btn"
                                    @click="changeFontSize(value)"
                            >
                                {{ value }}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="toolbar__ff">
                <button type="button"
                        class="base-component-menu__btn"
                        title="Шрифт"
                        @click="d_currDropdown = d_currDropdown!=='fontFamily' ? 'fontFamily' : 'nope'"
                >
                    <i class="uil uil-text" />
                </button>
                <div v-if="d_currDropdown === 'fontFamily'"
                     class="toolbar__dropdown"
                >
                    <ul>
                        <li class="toolbar__ff-input-wrap">
                            <input v-model="d_params.fontFamily.searchQuery"
                                   type="text"
                                   class="input"
                                   placeholder="Найти шрифт"
                            >
                        </li>
                        <li
                            v-for="value in c_filteredFonts"
                            :key="value.id"
                        >
                            <button type="button"
                                    class="toolbar__dropdown-btn"
                                    :class="[d_params.fontFamily.currValue === value ? 'active':'']"
                                    @click="changeFontFamily(value)"
                            >
                                {{ value }}
                            </button>
                        </li>
                        <li v-if="c_filteredFonts.length<1"
                            class="nothing-found"
                        >
                            Ничего не найдено
                        </li>
                    </ul>
                </div>
            </div>
            <editor-menu-bar v-slot="{ commands, isActive }"
                             :editor="d_editor"
            >
                <button type="button"
                        class="base-component-menu__btn"
                        title="Полужирный"
                        :class="{ 'is-active': isActive.bold() }"
                        @click="commands.bold"
                >
                    <i class="uil uil-bold" />
                </button>
            </editor-menu-bar>
            <editor-menu-bar v-slot="{ commands, isActive }"
                             :editor="d_editor"
            >
                <button type="button"
                        class="base-component-menu__btn"
                        title="Курсив"
                        :class="{ 'is-active': isActive.italic() }"
                        @click="commands.italic"
                >
                    <i class="uil uil-italic" />
                </button>
            </editor-menu-bar>
            <editor-menu-bar v-slot="{ commands, isActive }"
                             :editor="d_editor"
            >
                <button type="button"
                        class="base-component-menu__btn"
                        title="Зачеркивание"
                        :class="{ 'is-active': isActive.strike() }"
                        @click="commands.strike"
                >
                    <i class="uil uil-text-strike-through" />
                </button>
            </editor-menu-bar>
            <editor-menu-bar v-slot="{ commands, isActive }"
                             :editor="d_editor"
            >
                <button type="button"
                        class="base-component-menu__btn"
                        title="Подчеркивание"
                        :class="{ 'is-active': isActive.underline() }"
                        @click="commands.underline"
                >
                    <i class="uil uil-underline" />
                </button>
            </editor-menu-bar>
            <button type="button"
                    class="base-component-menu__btn"
                    title="Выравнивание текста"
                    @click="changeTextAlignment"
            >
                <i class="uil"
                   :class="`uil-align-${d_params.textAlign}`"
                />
            </button>
            <div>
                <!--Здесь нужно придумать как показывать группу кнопок (выравние по левому/правому краю, центру)-->
            </div>
        </template>
    </base-container>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import { Bold, Italic, Strike, Underline } from 'tiptap-extensions';
import BaseContainer from '~/components/BaseContainer';

export default {
    name: 'TextComponent',
    components: {
        BaseContainer,
        EditorContent,
        EditorMenuBar,
    },
    props: {
        editor: {
            type: Object,
            default() {
                return {};
            },
        },
        text: {
            type: String,
            default: '',
        },
        active: {
            type: Boolean,
            default: false,
        },
        id: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            d_editor: new Editor({ //
                editable: this.d_contenteditable,
                content: this.text, //
                extensions: [//
                    new Bold(), //
                    new Italic(), //
                    new Strike(), //
                    new Underline(), //
                ], //
            }), //

            d_text: this.text || null,
            d_currDropdown: 'nope',
            d_contenteditable: false,
            d_selectedEl: {},
            d_params: {
                // fontWeight: 'normal',
                // fontStyle: 'normal',
                // textDecoration: 'none',
                textAlignment: ['left', 'right', 'center', 'justify'],
                textAlign: 'left',
                fontSize: {
                    active: false,
                    values: [6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 42, 44, 46, 48, 50, 52, 54, 56, 60, 72, 80, 88, 96],
                    currValue: 30,
                    newValue: 30,
                },
                fontFamily: {
                    active: false,
                    values: ['Roboto', 'Raleway', 'Playfair Display', 'Oswald',
                        'Lobster', 'Pacifico', 'Yanone Kaffeesatz', 'Comfortaa', 'Caveat',
                        'Poiret One', 'Montserrat Alternates', 'Bad Script', 'Cormorant Infant', 'Kelly Slab'],
                    links: [],
                    currValue: '',
                    searchQuery: '',
                },
                color: {
                    active: false,
                    baseValues: ['#f44336', '#e91e63', '#7b1fa2', '#009688', '#2196f3', '#8bc34a', '#4caf50',
                        '#ffc107', '#ff1744', '#795548', '#000000', '#ffffff'],
                    currValue: '#000000',
                },
            },
        };
    },
    computed: {
        c_filteredFonts() {
            const res = this.d_params.fontFamily.values.filter(font =>
                font.toLowerCase().includes(this.d_params.fontFamily.searchQuery.toLowerCase()),
            );
            return res.length < 1 ? [] : res;
        },
        c_style() {
            return {
                fontWeight: this.d_params.fontWeight,
                fontStyle: this.d_params.fontStyle,
                textDecoration: this.d_params.textDecoration,
                textAlign: this.d_params.textAlign,
                fontSize: this.d_params.fontSize.newValue + 'px', // newValue
                lineHeight: 'normal',
                fontFamily: this.d_params.fontFamily.currValue,
                color: this.d_params.color.currValue,
            };
        },
    },
    watch: {
        d_contenteditable(val) {
            this.d_editor.setOptions({ editable: val });
            // console.log(val);
        },
    },
    beforeDestroy() {
        // Always destroy your editor instance when it's no longer needed
        this.d_editor.destroy();
    },
    mounted() {
        for (let i = 0; i < this.d_params.fontFamily.values.length; i++) {
            this.setFontFamilyLinks(this.d_params.fontFamily.values[i]);
        }
    },
    methods: {
        changeFontWeight() {
            this.editor.commands.bold();
            // this.d_params.fontWeight = this.d_params.fontWeight === 'normal' ? 'bold' : 'normal';
        },
        changeFontStyle() {
            if (window.getSelection().anchorNode) {
                const range = window.getSelection().getRangeAt(0);
                const selectionContents = range.extractContents();
                const i = document.createElement('i');
                i.appendChild(selectionContents);
                i.setAttribute('class', 'selected');
                // i.style.fontStyle = 'italic';
                range.insertNode(i);
                this.d_selectedEl = i;
                // console.log(this.d_selectedEl);
            } else {
                this.d_params.fontStyle = this.d_params.fontStyle === 'normal' ? 'italic' : 'normal';
            }
        },
        changeTextUnderline() {
            this.d_params.textDecoration = this.d_params.textDecoration === 'none' ? 'underline' : 'none';
        },
        changeTextAlignment() { // ф-я изменяет название класса иконки и стиль выравнивания текста
            let idx = this.d_params.textAlignment.indexOf(this.d_params.textAlign);
            (idx >= this.d_params.textAlignment.length - 1) ? idx = 0 : idx++;
            this.d_params.textAlign = this.d_params.textAlignment[idx];
        },
        changeFontSize(currValue) {
            this.d_params.fontSize.currValue = currValue;
            this.d_params.fontSize.newValue = currValue;
        },
        changeFontFamily(value) {
            this.d_params.fontFamily.currValue = value;
            // this.setFontFamilyLinks(this.d_params.fontFamily.currValue);
        },
        setFontFamilyLinks(val) {
            if (!this.d_params.fontFamily.links.includes(val)) {
                this.d_params.fontFamily.links.push(val);
                const link = document.createElement('link');
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('type', 'text/css');
                link.setAttribute('href', 'https://fonts.googleapis.com/css?family=' + val.replace(' ', '+'));
                document.head.appendChild(link);
            }
        },
        openDropdown(currDropdown) {
            // eslint-disable-next-line no-console
            console.log(currDropdown);
            this.d_currDropdown = currDropdown;
        },
    },
};
</script>

<style scoped lang="scss">

.textarea {
    height: 100%;
}

.toolbar__fc {

    .color-icon {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 2px solid rgba(0, 0, 0, .2);

        &:hover {
            transform: scale(1.2);
        }
    }

    .toolbar__dropdown {
        width: 185px;
        text-align: left;
        padding: 10px;

        .toolbar__dropdown-label {
            margin-bottom: 10px;
        }

        .toolbar__dropdown-group {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }

        .toolbar__dropdown-color-btn {
            outline: none;
            border: 2px solid rgba(0, 0, 0, .2);
            border-radius: 50%;
            height: 30px;
            width: 30px;
            margin: 0 10px 10px 0;
            cursor: pointer;

            &:hover {
                transform: scale(1.2);
            }
        }
    }

}

.toolbar__fz, .toolbar__ff {
    input {
        outline: none;
        color: #6f6f6f;
        margin: 0;
        padding: 0;
        border: none;
        text-align: center;
    }
}

.toolbar__fz {
    .toolbar__dropdown ul {
        height: 285px;
    }
}

.toolbar__ff {
    .toolbar__ff-input-wrap{
        display: flex;
    }
    input {
        padding: 6px;
        border-bottom: 2px solid #6f6f6f;
        &::placeholder{
            font-size: 14px;
        }
    }

    .toolbar__dropdown {
        min-width: 170px;
    }

    .nothing-found {
        padding: 6px 20px;
        border: none;
        outline: none;
        background: none;
        display: block;
        color: #6f6f6f7d;

    }
}

.base-component-menu__btn {
    display: flex;
    align-items: center;
    justify-content: center;

    &.is-active {
        background: rgba(111, 111, 111, .21);

    }
}

.toolbar__dropdown {
    color: #6f6f6f;
    background: white;
    border: 1px solid #d2d2d2;
    top: 0;
    left: 65px;
    border-radius: 20px;
    box-shadow: 0 6px 20px #606a75;
    /*box-shadow: 0 6px 20px #aed5ff;*/
    position: absolute;
    text-align: center;
    overflow: hidden;

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        height: 400px;
        overflow: hidden;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            width: 5px;
            background: transparent;
        }

        &::-webkit-scrollbar-track {
            background: #F5F5F5;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(#d2d2d2, .9);
        }

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
                    background: rgba(111, 111, 111, .13);
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
