<template>
  <div class="input-field">
    <label for="" class="input-field__label">
      {{label}}
      <div v-if="helper" class="input-field__label-helper">
        <svg class="input-field__label-helper-icon" 
          xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
          width="13" height="13"
          viewBox="0 0 172 172"
          style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g><path d="M169.34609,86c0,-46.02344 -37.32266,-83.34609 -83.34609,-83.34609c-46.02344,0 -83.34609,37.32266 -83.34609,83.34609c0,46.02344 37.32266,83.34609 83.34609,83.34609c46.02344,0 83.34609,-37.32266 83.34609,-83.34609z" fill="#9fa2b4"></path><path d="M49.08047,60.97266c0,-4.66953 1.51172,-9.40625 4.50156,-14.21016c2.98984,-4.80391 7.39063,-8.76797 13.13516,-11.92578c5.74453,-3.15781 12.46328,-4.73672 20.15625,-4.73672c7.12187,0 13.4375,1.31016 18.87969,3.96406c5.47578,2.62031 9.675,6.21484 12.66484,10.75c2.98984,4.53516 4.46797,9.43984 4.46797,14.74766c0,4.19922 -0.83984,7.86094 -2.55312,10.98516c-1.71328,3.15781 -3.72891,5.87891 -6.04687,8.16328c-2.35156,2.28438 -6.51719,6.14766 -12.59766,11.55625c-1.67969,1.51172 -3.02344,2.85547 -4.03125,4.03125c-1.00781,1.14219 -1.74688,2.21719 -2.25078,3.15781c-0.50391,0.97422 -0.87344,1.91484 -1.14219,2.88906c-0.26875,0.97422 -0.67187,2.65391 -1.20938,5.07266c-0.94062,5.10625 -3.86328,7.69297 -8.76797,7.69297c-2.55313,0 -4.70312,-0.83984 -6.45,-2.51953c-1.74687,-1.67969 -2.62031,-4.16563 -2.62031,-7.45781c0,-4.13203 0.63828,-7.72656 1.91484,-10.75c1.27656,-3.02344 2.98984,-5.67734 5.10625,-7.96172c2.11641,-2.28437 4.97187,-5.00547 8.56641,-8.16328c3.15781,-2.75469 5.40859,-4.8375 6.81953,-6.24844c1.41094,-1.41094 2.58672,-2.95625 3.52734,-4.70312c0.97422,-1.71328 1.44453,-3.59453 1.44453,-5.61016c0,-3.93047 -1.47812,-7.25625 -4.40078,-9.97734c-2.92266,-2.72109 -6.71875,-4.06484 -11.32109,-4.06484c-5.40859,0 -9.40625,1.37734 -11.95938,4.09844c-2.55312,2.72109 -4.73672,6.75234 -6.48359,12.06016c-1.67969,5.57656 -4.8375,8.33125 -9.50703,8.33125c-2.75469,0 -5.07266,-0.97422 -6.9875,-2.92266c-1.88125,-1.88125 -2.85547,-3.96406 -2.85547,-6.24844zM85.12656,141.86641c-2.98984,0 -5.61016,-0.97422 -7.86094,-2.92266c-2.25078,-1.94844 -3.35937,-4.66953 -3.35937,-8.16328c0,-3.09063 1.075,-5.71094 3.25859,-7.82734c2.15,-2.11641 4.8375,-3.15781 7.96172,-3.15781c3.09063,0 5.71094,1.075 7.82734,3.15781c2.11641,2.11641 3.15781,4.73672 3.15781,7.82734c0,3.46016 -1.10859,6.14766 -3.32578,8.12969c-2.21719,1.98203 -4.77031,2.95625 -7.65937,2.95625z" fill="#ffffff"></path></g></g></svg>
        <div class="input-field__label-helper-text">
          {{ helper }}
        </div>
      </div>
    </label>

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
      },
      helper: {
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
    display: flex;
    align-items: center;
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
    bottom: 1px;
    right: 1px;
    transform: translate(0, 0);
    flex: 1 0 100%;
    display: inline-block;
    margin-top: 3px;
    border: 1px solid #DFE0EB;
    border-radius: 4px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    padding: 0 .92rem;
    height: calc(2.85rem - 2px);
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
  
  .input-field__label-helper {
    margin-left: 10px;
    display: flex;
    align-items: center;
    position: relative;
    &-text {
      display: none;
      position: absolute;
      top: 25px;
      left: 30px;
      transform: translate(-100%, 0);
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 5px 10px;
      z-index: 10;
      border-radius: 6px;
      font-weight: 300;
      width: 200px;
      white-space: normal !important;
      transition-duration: .2s;
      &:after {
        content: '';
        position: absolute;
        border: 7px solid transparent; 
        border-bottom: 7px solid rgba(0, 0, 0, 0.7);
        transform: translate(-50%, -100%);
        top: 0px;
        left: calc(100% - 23px);
      }
    }
    &:hover .input-field__label-helper-text {
      display: block;
    }
    &:hover .input-field__label-helper-text {
      display: block;
    }
  }
</style>