<template>
    <aside class="sidebar">
        <text-btn class="sidebar__btn"
                  :editor="editor"
        />
        <img-btn class="sidebar__btn"
                 :editor="editor"
        />
    </aside>
</template>

<script>
import ImgBtn from '~/components/slidebar/buttons/ImgBtn';
import TextBtn from '~/components/slidebar/buttons/TextBtn';

export default {
    name: 'SidebarComponent',
    components: { ImgBtn, TextBtn },
    props: {
        editor: {
            type: Object,
            default() {
                return {};
            },
        },
    },
};
</script>

<style scoped lang="scss">
.sidebar {
    background: white;
    border: 1px solid #d2d2d2;
    bottom: 15px;
    left: 15px;
    border-radius: 20px;
    /*box-shadow: 0 6px 20px #aed5ff;*/
    box-shadow: 0 6px 20px #606a75;
    position: absolute;
    z-index: 1000;
    display: flex;
}

.sidebar__btn {
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
</style>
