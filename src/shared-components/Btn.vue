<template>
  <button @blur="$emit('onInput', {e: $event, pk: pk})" class="btn btn-primary" :disabled="isDisabled" :class="`${defaultClass} ${_clazz} ${loading ? 'loading ld-ext-right running' : ''}`" :type="type" @click="onClick">
    <span v-if="!loading">
      {{label}}
      <slot/>
    </span>
    <span v-else>
      <div class="ld ld-ring ld-spin"></div>
    </span>
  </button>
</template>

<script>
  export default {
    name: "Btn",
    props: {
      type: {
        type: String,
        default: 'button',
      },
      clazz: {
        value: [String, Object],
        default: '',
      },
      label: {
        type: String,
        default: '',
      },
      withoutDefaultClass: {
        type: Boolean,
        default: false
      },
      clickHandler: {
        type: Function,
        default: null,
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      },
      pk: {
        type: Number
      }
    },
    computed: {
      defaultClass() {
        return this.withoutDefaultClass ? '' : 'button';
      },
      _clazz() {
        if (typeof this.clazz === 'string') {
          return this.clazz;
        }

        return Object.keys(this.clazz).filter(key => this.clazz[key]).join(' ');
      }
    },
    methods: {
      onClick($event) {
        if (this.clickHandler) {
          $event.preventDefault();
          $event.stopPropagation();
          this.clickHandler($event);
        } else {
          this.$emit('click', $event)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/scss/variables";

  button {
    cursor: pointer;
  }

  .button {
    background: $yellow;
    height: 2.85rem;
    border-radius: 4px;
    width: 100%;
    font-weight: bold;
    color: black;
    letter-spacing: .2px;
    padding: 0 .92rem;

    &.button_gray {
      background: $drayDevider;
    }

    &.button_empty {
      border: 1px solid $drayDevider;
      background: white;
    }

    &.button_align-left {
      text-align: left;
    }

    &:disabled {
      background: #DFE0EB;
      cursor: default;
      padding: 0 .92rem;
    }
    &.loading {
      background: #DFE0EB;
      cursor: default;
      pointer-events: none;
      font-size: 20px;
      padding: 0px 2rem !important;
      display: flex;
      align-items: center;
      justify-content: center;
      transition-duration: 0s;
      & span {
        display: flex;
        align-items: center;
        justify-content: center;
        transition-duration: 0s;
      }
      & * {
        transition-duration: 0s;
      }
    }
  }

  .button__change {
    background: url("../assets/img/ikons/edit.svg") no-repeat, $yellow;
    background-position: calc(100% - 2.5rem) center;
    padding-right: 1.14rem;
  }

  .button_add {
    background: url("../assets/img/ikons/plus3.svg") no-repeat, $yellow;
    background-position: calc(100% - .78rem) center;
    text-align: left;
    padding-left: 1rem;
  }

  .button_save {
    background: url("../assets/img/ikons/search2.svg") no-repeat, $yellow;
    background-position: 2.85rem center;
    padding-left: 2.2rem;
  }

  .button_check {
    background: url("../assets/img/ikons/check.svg") no-repeat, $yellow;
    background-position: calc(100% - .64rem) center;
  }

  .button_filter {
    padding-right: 70px !important;
    overflow: hidden;
    white-space: nowrap;
    display: flex;
    align-items: center;
    & span {
      display: block;
      width: 100%;
      overflow: hidden;
    }
  }
</style>