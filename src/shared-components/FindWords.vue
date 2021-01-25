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

    <!-- <span class="input-field__error" v-if="!!error">{{error}}</span> -->

    <div ref="inputWordsWrapper" class="input-field-wrapper">
      <input 
           @keyup.enter="word.replace(/\s+/g, '').length > 0 ? addNewWord(word) : false"
           @blur="word.replace(/\s+/g, '').length > 0 ? addNewWord(word) : false"
           v-model="word"
           :class="`input-field__input`"
           :style="`
           padding-left: ${paddingLeftInput}px;
           padding-top: ${paddingTopInput}px;
           padding-bottom: ${paddingBottomInput}px;
           `"/>
        <div v-if="items.length > 0" ref="inputValues" class="input-field-wrapper-values">
        <span @click="removeProduct(i)" v-for="i in items" :key="i" class="input-field-wrapper-values-item">
          <p class="text">{{ i }}</p>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 348.333 348.333"><path d="M336.559 68.611L231.016 174.165l105.543 105.549c15.699 15.705 15.699 41.145 0 56.85-7.844 7.844-18.128 11.769-28.407 11.769-10.296 0-20.581-3.919-28.419-11.769L174.167 231.003 68.609 336.563c-7.843 7.844-18.128 11.769-28.416 11.769-10.285 0-20.563-3.919-28.413-11.769-15.699-15.698-15.699-41.139 0-56.85l105.54-105.549L11.774 68.611c-15.699-15.699-15.699-41.145 0-56.844 15.696-15.687 41.127-15.687 56.829 0l105.563 105.554L279.721 11.767c15.705-15.687 41.139-15.687 56.832 0 15.705 15.699 15.705 41.145.006 56.844z"></path></svg>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "InputWords",
    props: {
      label: String,
      value: Array,
      helper: String
    },
    data() {
      return {
        items: [],
        
        word: '',

        paddingLeftInput: 10,
        paddingTopInput: 0,
        paddingBottomInput: 0
      }
    },
    computed: {

    },
    watch: {
      items: function () {
        this.$nextTick(function () {
          if(this.$refs.inputValues) {
            this.paddingLeftInput = this.$refs.inputValues.clientWidth
          } else {
            this.paddingLeftInput = 10
          }
          if(this.$refs.inputWordsWrapper && this.$refs.inputValues) {
            if(this.$refs.inputWordsWrapper.clientWidth <= this.$refs.inputValues.clientWidth) {
              this.paddingLeftInput = 10
              this.paddingTopInput = this.$refs.inputValues.clientHeight
              this.paddingBottomInput = 15
            } else {
              this.paddingTopInput = 0
              this.paddingBottomInput = 0
            }
          }
        })
      },
      value: {
        handler: function () {
          this.items = [...this.value]
        },
        deep: true
      }
    },
    methods: {
      addNewWord(word) {
        this.items.push(word)
        this.word = ''
        this.$emit('input', this.items)
      },
      removeProduct (word) {
        this.items.splice(this.items.findIndex(item => item === word), 1)
        this.$emit('input', this.items)
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "../assets/scss/variables";

  .input-field {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-content: center;
    flex-wrap: wrap;
  }

  .input-field__label {
    letter-spacing: .2px;
    color: $titleColor;
    font-weight: bold;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .input-field__error {
    color: $red;
    letter-spacing: .2px;
  }

  .input-field__input {
    flex: 1 0 100%;
    display: block;
    // margin-top: 4px;
    border: 1px solid $drayDevider;
    border-radius: 4px;
    padding: 0 .92rem;
    // min-height: 2.65rem;
    width: 100%;
    letter-spacing: .2px;
    color: black;
    position: relative !important;
    margin-top: 5px;

    &.input-field__input_error {
      border-color: red;
      color: $red;
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
  }

  .input-field-wrapper {
    position: relative;
    width: 100%;
    min-height: 2.85rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    & .input-field__input {
      position: absolute;
    }
  }

  .input-field-wrapper-values {
    position: absolute;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    // top: 50%;
    padding: 5px 0.46rem;
    // transform: translate(0, -50%);
    margin: 3px -1px 0px -1px;
  }
  
  .input-field-wrapper-values-item {
    display: block;
    padding: 2px 0;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 500;
    color: #039be5;
    cursor: pointer;
    user-select: none;
    margin: 3px 1px 1px 1px;
    display: flex;
    background: #e3f2fd;
  }
  .input-field-wrapper-values-item p {
    border: 1px solid transparent;
    padding: 0px 5px;
    border-right: 1px solid #fff;
  }
  .input-field-wrapper-values-item svg {
    width: 6px;
    height: 6px;
    fill: #039be5;
  }
  .input-field-wrapper-values-item:hover svg {
    fill: red;
  }
  .input-field-wrapper-values-item span {
    width: 17px;
    height: 17px;
    display: flex;
    align-items: center;
    justify-content: center;
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
      left: 7px;
      transform: translate(-50%, 0);
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
        left: 50%;
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