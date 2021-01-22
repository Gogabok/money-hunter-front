<template>
  <div @click="chekingWidth()" class="select-field">
    <label for="" class="select-field__label">
      {{label}}
      <div v-if="helper" class="select-field__label-helper">
        <svg class="select-field__label-helper-icon"
          xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
          width="16" height="16"
          viewBox="0 0 172 172"
          style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g><path d="M169.34609,86c0,-46.02344 -37.32266,-83.34609 -83.34609,-83.34609c-46.02344,0 -83.34609,37.32266 -83.34609,83.34609c0,46.02344 37.32266,83.34609 83.34609,83.34609c46.02344,0 83.34609,-37.32266 83.34609,-83.34609z" fill="#ffc700"></path><path d="M49.08047,60.97266c0,-4.66953 1.51172,-9.40625 4.50156,-14.21016c2.98984,-4.80391 7.39063,-8.76797 13.13516,-11.92578c5.74453,-3.15781 12.46328,-4.73672 20.15625,-4.73672c7.12187,0 13.4375,1.31016 18.87969,3.96406c5.47578,2.62031 9.675,6.21484 12.66484,10.75c2.98984,4.53516 4.46797,9.43984 4.46797,14.74766c0,4.19922 -0.83984,7.86094 -2.55312,10.98516c-1.71328,3.15781 -3.72891,5.87891 -6.04687,8.16328c-2.35156,2.28438 -6.51719,6.14766 -12.59766,11.55625c-1.67969,1.51172 -3.02344,2.85547 -4.03125,4.03125c-1.00781,1.14219 -1.74688,2.21719 -2.25078,3.15781c-0.50391,0.97422 -0.87344,1.91484 -1.14219,2.88906c-0.26875,0.97422 -0.67187,2.65391 -1.20938,5.07266c-0.94062,5.10625 -3.86328,7.69297 -8.76797,7.69297c-2.55313,0 -4.70312,-0.83984 -6.45,-2.51953c-1.74687,-1.67969 -2.62031,-4.16563 -2.62031,-7.45781c0,-4.13203 0.63828,-7.72656 1.91484,-10.75c1.27656,-3.02344 2.98984,-5.67734 5.10625,-7.96172c2.11641,-2.28437 4.97187,-5.00547 8.56641,-8.16328c3.15781,-2.75469 5.40859,-4.8375 6.81953,-6.24844c1.41094,-1.41094 2.58672,-2.95625 3.52734,-4.70312c0.97422,-1.71328 1.44453,-3.59453 1.44453,-5.61016c0,-3.93047 -1.47812,-7.25625 -4.40078,-9.97734c-2.92266,-2.72109 -6.71875,-4.06484 -11.32109,-4.06484c-5.40859,0 -9.40625,1.37734 -11.95938,4.09844c-2.55312,2.72109 -4.73672,6.75234 -6.48359,12.06016c-1.67969,5.57656 -4.8375,8.33125 -9.50703,8.33125c-2.75469,0 -5.07266,-0.97422 -6.9875,-2.92266c-1.88125,-1.88125 -2.85547,-3.96406 -2.85547,-6.24844zM85.12656,141.86641c-2.98984,0 -5.61016,-0.97422 -7.86094,-2.92266c-2.25078,-1.94844 -3.35937,-4.66953 -3.35937,-8.16328c0,-3.09063 1.075,-5.71094 3.25859,-7.82734c2.15,-2.11641 4.8375,-3.15781 7.96172,-3.15781c3.09063,0 5.71094,1.075 7.82734,3.15781c2.11641,2.11641 3.15781,4.73672 3.15781,7.82734c0,3.46016 -1.10859,6.14766 -3.32578,8.12969c-2.21719,1.98203 -4.77031,2.95625 -7.65937,2.95625z" fill="#ffffff"></path></g></g></svg>
        <div class="select-field__label-helper-text">
          {{ helper }}
        </div>
      </div>
    </label>
    <span class="select-field__error" v-if="!!error">{{error}}</span>
    <VendorTreeSelect ref="treeselect"
                      v-bind="$attrs"
                      :value="value"
                      v-on="listeners"
                      @open="searchChange"
                      class="select-field__select">
      <div slot="value-label" slot-scope="{ node }">{{ getValue(node) }}</div>

    </VendorTreeSelect>
  </div>
</template>

<script>
  import VendorTreeSelect from '@riophae/vue-treeselect';
  import '@riophae/vue-treeselect/dist/vue-treeselect.css';
  export default {
    name: "TreeSelect",
    components: {VendorTreeSelect},
    props: {
      label: {
        type: String,
        required: true,
      },
      value: {
        required: true,
      },
      dontUseLocalSearch: {
        type: Boolean,
        default: false,
      },
      error: {
        type: String,
        default: null
      },
      helper: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      searchWidthActivated: false
    }),
    computed: {
      listeners() {
        const data = {...this.$listeners};
        if (this.dontUseLocalSearch) {
          delete data['search-change'];
        }
        return data;
      }
    },
    methods: {
      getValue(node) {
        const label = node.label;
        if (label.endsWith(' (unknown)')) {
          return label.substr(0, label.lastIndexOf(' (unknown)'));
        }
        return label;
      },
      getMenu() {
        return this.$refs.treeselect.getMenu();
      },
      searchChange(value) {
        return;
        // const rightConerOfField = document.querySelector(".select-field").getBoundingClientRect().right
        // const rightConerOfFilter = document.querySelector(".filter-form__columns").getBoundingClientRect().right - 10
        
        // const differentBetweenConers = rightConerOfFilter - rightConerOfField
        // const defaultWidth = document.querySelector(".filter .customWidthSelector .select-field").offsetWidth
        // if(value.length > 0 && document.querySelector(".filter .customWidthSelector .vue-treeselect__menu")) {
        //   this.searchWidthActivated = true
        //   document.querySelector(".filter .customWidthSelector .vue-treeselect__menu").style.width = `${defaultWidth + differentBetweenConers}px`
        // } else if (document.querySelector(".filter .customWidthSelector .vue-treeselect__menu") && value.length <= 0){
        //   this.searchWidthActivated = false
        //   document.querySelector(".filter .customWidthSelector .vue-treeselect__menu").style.width = `${defaultWidth}px`
        // }
      },
      chekingWidth() {
        if(document.documentElement.offsetWidth > 768) {
          // const amountOfNodes = 10
          // const defaultWidth = document.querySelector(".select-field").offsetWidth
          // const extraWidthSize = 75
          // let extraWidth = 0
          // for(let i = 2; i < amountOfNodes; i++) {
          //   if(document.querySelector(`.vue-treeselect__indent-level-${i}`)) {
          //     extraWidth += extraWidthSize
          //   }
          // }
          // if(document.querySelector(".filter .customWidthSelector .vue-treeselect__menu")) {
          //   document.querySelector(".filter .customWidthSelector .vue-treeselect__menu").style.width = `${defaultWidth + extraWidth}px`
          // }
          const rightConerOfField = document.querySelector(".select-field").getBoundingClientRect().right
          const rightConerOfFilter = document.querySelector(".filter-form__columns").getBoundingClientRect().right - 10
          
          const differentBetweenConers = rightConerOfFilter - rightConerOfField
          const defaultWidth = document.querySelector(".filter .customWidthSelector .select-field").offsetWidth
          if(document.querySelector(".filter .customWidthSelector .vue-treeselect__menu")) {
            document.querySelector(".filter .customWidthSelector .vue-treeselect__menu").style.width = `${defaultWidth + differentBetweenConers}px`
          }
        }
      },
      handleLocalSearch() {
        const origFunc = this.$refs.treeselect.handleLocalSearch;
        this.$refs.treeselect.handleLocalSearch = () => {
          if (this.dontUseLocalSearch) {
            this.$emit('search-change', this.$refs.treeselect.trigger.searchQuery);
          } else {
            origFunc.call(this.$refs.treeselect);
          }
        }
      }
    },
    mounted() {
      this.handleLocalSearch();
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/scss/variables";
  .select-field__error {
    color: $red;
    letter-spacing: .2px;
  }
  .select-field {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-content: center;
    flex-wrap: wrap;
  }
  .select-field__label {
    letter-spacing: .2px;
    color: $titleColor;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .select-field__select {
    flex: 1 0 100%;
    display: block;
    margin-top: 5px;
  }
  .categories__link {
    padding: 8px 14px;
    display: block;
    background: url("../assets/img/ikons/categories-open.svg") no-repeat calc(100% - 12px) center;
    transition: all ease-in .2s;
    &:hover {
      background: url("../assets/img/ikons/categories-open.svg") no-repeat calc(100% - 12px) center, $yellow;
    }
  }
  .categories__link_open, .categories__link_open:hover {
    background: url("../assets/img/ikons/categories-close.svg") no-repeat calc(100% - 12px) center, $yellow;
  }
  .categories__sub-categories-item {
    padding: 7px 14px 7px 30px;
    transition: all ease-in .2s;
    &:hover {
      background: #EFF6FD;
      span {
        color: $blue;
      }
    }
    label {
      display: flex;
      align-items: center;
    }
    input {
      margin-right: 10px;
    }
    span {
      color: #9FA2B4;
      letter-spacing: .2px;
      transition: all ease-in .2s;
    }
  }
  .select-field__label-helper {
    &-text {
      display: none;
      position: absolute;
      top: 25px;
      left: calc(100% - 8px);
      transform: translate(-50%, 0);
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 5px 10px;
      z-index: 10;
      border-radius: 6px;
      max-width: 300px;
      font-weight: 300;
      width: 100%;
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
    &:hover .select-field__label-helper-text {
      display: block;
    }
    &:hover .select-field__label-helper-text {
      display: block;
    }
  }
</style>