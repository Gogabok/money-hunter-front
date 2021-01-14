<template>
  <div class="input-field">
    <label for="" class="input-field__label">{{label}}</label>

    <span class="input-field__error" v-if="!!error">{{error}}</span>

    <div class="input-field__range" v-if="range">
      <input type="number"
             class="input-field__input_range"
             placeholder="Min"
             :disabled="disabled"
             v-model.number="value[0]"
             :min="min"
             :max="max"
             @blur="$emit('input', minTransformer())">
      <span>-</span>
      <input type="number"
             class="input-field__input_range"
             placeholder="Max"
             :disabled="disabled"
             v-model.number="value[1]"
             :min="min"
             :max="max"
             @blur="$emit('input', maxTransformer())">
    </div>

    <div v-else class="input-field__symbol-wrapper">
      <input :disabled="disabled"
           :type="_type"
           :value="value"
           :class="`input-field__input ${!!error ? 'input-field__input_error ' : ''}`+clazz"
           :placeholder="placeholder"
           v-mask="mask"
           @input="$emit('input', $event.target.value)"/>
      <div v-if="symbol" class="input-field__symbol">
        {{ symbol }}
      </div>
    </div>
    <button
      v-if="buttonLabel"
      class="input-button"
      type="button"
      @click="$emit('button-event')"
    >
      {{ buttonLabel }}
    </button>
    <button class="vision-password vision-password_error"
            :class="{'vision-password_visible': !showPassword}"
            @click="showPassword=!showPassword"
            v-if="isPassword"
            type="button"/>
  </div>
</template>

<script>
  export default {
    name: "InputField",
    props: {
      label: {
        type: String,
        default: '',
      },
      error: {
        type: String,
        default: null,
      },
      range: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        default: 'text',
      },
      value: {
        value: [String | Array],
        default: '',
      },
      clazz: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      mask: {
        type: [Object, String],
        default: '',
      },
      min: {
        type: Number,
        default: -Infinity
      },
      max: {
        type: Number,
        default: Infinity,
      },
      buttonLabel: {
        type: [String, Boolean],
        default: false
      },
      symbol: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        showPassword: false,
      }
    },
    computed: {
      _type() {
        if (this.type !== 'password') {
          return this.type;
        }

        return this.showPassword ? 'text' : 'password';
      },
      isPassword() {
        return this.type === 'password';
      }
    },
    methods: {
      minTransformer() {
        const _v = this.value[0];
        const min = this.min;
        const max = this.value[1] || this.max;
        return [_v < min ? min : (_v > max ? max : _v), this.value[1]];
      },
      maxTransformer() {
        const _v = this.value[1];
        const min = this.value[0] || this.min;
        const max = this.max;

        return [this.value[0], _v > max ? max : (_v < min ? min : _v)];
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/scss/variables";

  .input-field {
    position: relative;
    display: flex;
    // justify-content: space-between;
    align-content: center;
    flex-wrap: wrap;
    display: block;
  }

  .input-field__label {
    letter-spacing: .2px;
    color: $titleColor;
    font-weight: bold;
    display: block;
  }

  .filter-form__column-item .input-field__label {
    white-space: nowrap;
  }

  .input-field__error {
    color: $red;
    letter-spacing: .2px;
  }

  .input-field__symbol-wrapper {
    position: relative;
    & .input-field__symbol {
      position: absolute;
      right: 0px;
      font-weight: 400;
      top: 50%;
      height: 100%;
      min-width: 40px;
      padding: 0px 5px;
      border-left: 1px solid #DFE0EB;
      background: rgba(223, 224, 235, .3);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      transform: translate(0%, -50%);
      user-select: none;
    }
  }

  .input-field__input {
    flex: 1 0 100%;
    display: block;
    margin-top: 3px;
    border: 1px solid $drayDevider;
    border-radius: 4px;
    padding: 0 .92rem;
    height: 2.85rem;
    width: 100%;
    letter-spacing: .2px;
    color: black;

    &.input-field__input_error {
      border-color: red;
      color: $red;
    }

    &.input-field__input_success {
      border-color: rgba(36, 241, 6, 0.46);
    }
  }

  .input-field__range {
    display: flex;
    align-items: center;

    span {
      margin: 0 .35rem;
    }
  }

  .input-field__input_range {
    border-bottom: 1px solid $drayDevider;
    background: none;
    letter-spacing: .2px;
    color: black;
    width: 50%;
    height: 2.85rem;
    padding: 0 5px;
    min-width: 60px;
  }

  .input-button {
    position: absolute;
    bottom: 0px;
    right: 0px;
    transform: translate(0, 0);
    flex: 1 0 100%;
    display: inline-block;
    margin-top: 3px;
    border: 1px solid #DFE0EB;
    border-radius: 4px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    padding: 0 .92rem;
    height: 2.85rem;
    letter-spacing: .2px;
    color: black;
    background: #FFC700;
    font-weight: bold;
    cursor: pointer;
    &:disabled {
      background: #DFE0EB;
      cursor: default;
      pointer-events: none;
    }
  }
</style>