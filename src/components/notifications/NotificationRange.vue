<template>
    <div class="notificationRange">
        <div class="notificationRange-header">
            <span class="notificationRange-header__title">{{ rangeData.title }}</span>
            <label class="notificationRange-header__button" :for="`notificationRange-header__button-checkbox-${rangeData.title}`">
                <input v-model="isRangeVissible" type="checkbox" :id="`notificationRange-header__button-checkbox-${rangeData.title}`" />
                <div class="slider round"></div>
            </label>
        </div>
        <transition name="toggleDown" mode="out-in">
            <div v-show="isRangeVissible" class="notificationRange-isVissibleRange">
                <span class="notificationRange-desc">{{ rangeData.desc }} <b>{{ value }}{{ rangeData.currency }}</b></span>
                <vue-range-slider
                    v-model="value"
                    :tooltip="'hover'"
                    :process-style="{background: `#FFC700`}"
                    :tooltip-dir="'bottom'"
                    :tooltip-style="{background: `#FFC700`, borderColor: `#FFC700`}"
                    :min="rangeData.range[0]"
                    :max="rangeData.range[1]"
                />
            </div>
        </transition>
    </div>
</template>
<script>

import 'vue-range-component/dist/vue-range-slider.css'
import VueRangeSlider from 'vue-range-component'

export default {
    name: "notificationRange",
    components: {
        VueRangeSlider
    },
    props: {
        rangeData: {
            type: Object,
            required: true
        }
    },
    data: () => ({
        value: 1,
        isRangeVissible: true
    }),
    watch: {
        value: function () {
            this.$emit('changeValue', this.isRangeVissible
            ? {
                value: this.value,
                title: this.rangeData.title,
            }
            : {
                value: false,
                title: this.rangeData.title
            });
        },
        isRangeVissible: function () {
            this.$emit('changeValue', this.isRangeVissible
            ? {
                value: this.value,
                title: this.rangeData.title,
            }
            : {
                value: false,
                title: this.rangeData.title
            });
        }
    },
    mounted() {
        this.isRangeVissible = this.rangeData.isActive;
        this.value = this.rangeData.value;
    },
}
</script>

<style lang="scss" scoped>
    .notificationRange {
        border: 1px solid #DFE0EB;
        border-radius: 8px;
        padding: 20px 20px;
        margin-bottom: 10px;
        user-select: none;
        &-isVissibleRange {
            height: 70px;
            padding-top: 20px;
        }
        .toggleDown-enter-active, .toggleDown-leave-active {
            transition-duration: .4s;
            overflow: hidden;
        }
        .toggleDown-enter, .toggleDown-leave-to /* .fade-leave-active до версии 2.1.8 */ {
            height: 0;
            opacity: 1;
            padding-top: 0;
        }
        &-header {
            color: #000;
            padding: 0px 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            &__title {
                font-weight: bold;
                font-size: 1.2rem;
            }
            &__button {
                display: inline-block;
                height: 26px;
                position: relative;
                width: 46px;
                & input {
                    display:none;
                }
                & .slider {
                    background-color: #F7F8FC;
                    border: 1px solid #DFE0EB;
                    bottom: 0;
                    cursor: pointer;
                    left: 0;
                    position: absolute;
                    right: 0;
                    top: 0;
                    transition: .4s;
                    &:before {
                        background-color: #DFE0EB;
                        bottom: 2px;
                        content: "";
                        height: 20px;
                        left: 3px;
                        position: absolute;
                        transition: .4s;
                        width: 20px;
                    }
                }
                & input:checked + .slider {
                    &.round::before {
                        background: #FFC700;
                    }
                    &:before {
                        transform: translateX(18px);
                    }
                }
                & .slider.round {
                    border-radius: 25.5px;
                    &:before {
                        border-radius: 50%;
                    }
                }
            }
        }
        &-desc {
            color: #000;
            padding: 0px 5px;
            font-size: 14px;
        }
    }
</style>