<template>
  <div @click="chekingWidth()" class="select-field">
    <label for="" class="select-field__label">{{label}}</label>
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
    display: block;
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
</style>