<template>
  <Fragment>
    <tr class="tracking-table__row" 
      :class="{'tracking-table__row_open': rowOpened, 'selecting': isSelecting}"
      :style="mappedList[0].linkTo === 'articul' ? 'cursor: pointer' : false" 
      @click="open"
      @mousedown="mappedList[0].linkTo === 'articul' ? linkTo(mappedList[1].content) : false">

      <input @input="selectItemsEmit" v-model="checkbox" type="checkbox" :id="index" class="cbx" style="display: none;">
      <label v-if="isSelecting" :for="index" class="check">
        <svg width="18px" height="18px" viewBox="0 0 18 18">
          <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
          <polyline points="1 9 7 14 15 4"></polyline>
        </svg>
      </label>
      
      <td class="tracking-table__cell"
          :class=" {[headerWidth[idx].status]: headerWidth[idx].status, 
          [headerWidth[idx].clazz]: headerWidth[idx].clazz, 
          [item.clazz]: item.clazz, 
          'tracking-table__cell_open': isCellOpen(idx), 
          'tracking-table__cell_dropdown': isCellDropDown(idx)}"
          :style="{cursor: item.onClick ? 'pointer' : 'inherit'}"
          v-for="(item, idx) in mappedList"
          @click.exact="item.onClick ? item.onClick(item) : ()=>{}"
          :key="idx">
        <component v-bind:is="item.content" v-if="typeof item.content==='object'" v-bind="item.component_data"/>
        <!-- <template v-else>{{item.content}}</template> -->
        <template v-else>
           <div v-if="item.image" class="product-photo row-with-photo"><img :src="item.image" alt="">{{ formattingNum(item) }}</div>
           <span v-else>
             {{ formattingNum(item) }}
             <div class="tracking-table__cell-splicedPrice" v-if="item.name === 'currentPrice'">
               (<span @click.stop="openCalculator">{{ rowData.splicedPrice.firstPrice }}₽</span> | <span @click.stop="openCalculator">{{ rowData.splicedPrice.secondPrice }}₽</span>)
             </div>
           </span>
        </template>
      </td>
    </tr>
    <tr class="tracking-table-dropdown tracking-table__row_open" v-if="rowData.nested && rowOpened">
      <td class="tracking-table-dropdown__item" :colspan="mappedList.length">
        <div :class="rowData.nested.clazz || ''">
          <component v-bind:is="getNested(rowData.nested)" v-bind="rowData.nested"/>
        </div>
      </td>
    </tr>
  </Fragment>
</template>

<script>
  import {Fragment} from 'vue-fragment';
  import Calculator from '@/components/blackbox/Calculator'
  import {SHOW_MODAL_MUTATION} from "@/store/modules/modal/constants";

  export default {
    name: "TrackingTableRow",
    components: {Fragment},
    props: {
      rowData: {
        type: Object,
        required: true,
      },
      headerKeys: {
        type: Array,
        required: true,
      },
      headerWidth: {
        type: Array,
        required: false
      },
      index: {
        type: Number
      },
      isSelecting: {
        type: Boolean
      },
      selectedItems: {
        type: Array
      }
    },
    data() {
      return {
        rowOpened: false,
        checkbox: false
      };
    },
    computed: {
      mappedList() {
        const result = [];

        this.headerKeys.forEach(name => result.push({...this.rowData[name], name: name}));

        return result;
      }
    },
    methods: {
      getNested(nested) {
        if (nested.content) {
          return nested.content;
        }
        return nested;
      },
      open() {
        if (this.rowData.nested) {
          this.rowOpened = !this.rowOpened;
        }
      },
      isCellOpen(idx) {
        return idx === 0 && this.rowOpened;
      },
      isCellDropDown(idx) {
        return idx === 0 && !this.rowOpened && this.rowData.nested;
      },
      formattingNum(n) {
        if(n.name !== 'articul' && n.name !== 'name') {
          return n.content.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        } else {
          return n.content
        }
      },
      linkTo(articul) {
        this.$router.push({name: 'trackingPositions.group', params: {name: articul}});
      },
      selectItemsEmit() {
        this.$emit("selectItemsMethod", this.index)
      },
      openCalculator() {
        this.$store.commit(`modal/${SHOW_MODAL_MUTATION}`, {
          component: Calculator,
          data: {pk: this.rowData.pk, articul: this.rowData.articul.content}
        });
      }
    },
    watch: {
      selectedItems: function () {
        if(this.selectedItems.indexOf(this.index) > -1) {
          this.checkbox = true
        } else {
          this.checkbox = false
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/scss/variables";

  // .width5 {
  //   width: 5%;
  // }

  // .width9 {
  //   width: 9%;
  //   white-space: nowrap;
  // }

  // .width23 {
  //   width: 23%;
  // }

  // .width30 {
  //   width: 30%;
  // }

  // .width10 {
  //   width: 10%;
  // }

  // .width25 {
  //   width: 25%;
  // }

  .hidden {
    display: none;
  }

  .mw400 {
    min-width: 400px;
    max-width: 400px;
  }

  .mw300 {
    min-width: 300px;
    max-width: 300px;
  }

  .mw200 {
    min-width: 200px;
    max-width: 200px;
  }

  .mw150 {
    min-width: 150px;
    max-width: 150px;
  }

  .mw100 {
    min-width: 100px;
    max-width: 100px;
  }

  .mw50 {
    min-width: 50px;
    max-width: 50px;
  }

  .tracking-table {
    // width: 100%;
  }

  .tracking-table__row {
    // width: 100%;
    // min-width: 910px;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    position: relative;
    border-top: 1px solid $drayDevider;
    @media screen and (max-width: 1400px) {
      & .tracking-table__cell {
        font-size: 12px;
      }
    }
    @media screen and (max-width: 1420px) {
      min-width: 1250px;
      max-width: 1250px;
    }
   
  }

  .tracking-table__row_open {
    background: $gray3;
    display: flex;
    // justify-content: center;
    // min-width: 1250px;
    & .tracking-table-dropdown__item {
      margin: 20px auto 0px auto;
    }
  }

  .positive {
    color:#0ad406;
  }

  .negative {
    color: #ff0303;
  }

  .tracking-table__cell {
    // border-top: 1px solid $drayDevider;
    // padding: 1.71rem .5rem 1.71rem 20px;
    // padding: 1.85rem 1.21rem;
    // padding: 15px 15px 15px 15px;
    // padding-left: 1.21rem;
    // padding: 15px 15px 15px 5px;
    padding: 15px 5px 15px 5px;
    text-align: right;
    justify-content: flex-end;
    letter-spacing: .2px;
    box-sizing: border-box;
    &-splicedPrice {
      font-size: 12px;
      margin-bottom: -16px;
      @media screen and (max-width: 1400px) {
        margin-bottom: -18px;
      }
      & span {
        color: rgb(177, 138, 0);
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    &.width5 {
      white-space: nowrap;
    }
    &.tracking-table__align-center {
      text-align: center;
      justify-content: center;
      padding-left: 0;
      padding-right: 10px;
    }
    &.tracking-table__align-left {
      text-align: left;
      justify-content: flex-start;
      padding-right: 10px;
      &.pl-35 {
        padding-left: 35px !important;
      }
      &.pr-35 {
        padding-left: 35px !important;
      }
    }

    &.tracking-table__cell_dropdown {
      background: url("../assets/img/ikons/tracking-open.svg") no-repeat .71rem center;
    }

    &.tracking-table__cell_open {
      background: url("../assets/img/ikons/tracking-close.svg") no-repeat .71rem center;
    }

    // &:first-child {
    //   padding-left: 1.64rem;
    // }

    // &:last-child {
    //   padding-right: .78rem;
    // }
    &.itemWidthImage  {
      padding-left: 35px !important;
    }

    &:last-child {
      padding-right: 35px !important;
    }
  }

  .tracking-table-dropdown__item {
    padding-bottom: 1.28rem;

    &:first-child {
      padding-left: 1.64rem;
    }

    div {
      display: flex;

      &.tracking-table-dropdown__item-chart {
        justify-content: center;
      }

      /* для charts js - либа генерит div*/
      /deep/ & .chartjs-render-monitor {
        background-color: white;
      }

      /deep/ & .chartjs-render-monitor {
        width: 650px !important;
        height: 240px !important;
        margin: 0px auto !important;
      }
    }
  }

  .row-with-photo {
    display: flex;
    align-items: center;
    & img {
      margin-right: 15px;
    }
  }



  .check {
    cursor: pointer;
    position: absolute;
    margin: auto 25px auto 35px;
    width: 18px;
    height: 18px;
    -webkit-tap-highlight-color: transparent;
    transform: translate3d(0, 0, 0);
    left: 0px;
  }
  .check:before {
    content: "";
    position: absolute;
    top: -15px;
    left: -15px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(34,50,84,0.03);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .check svg {
    position: relative;
    z-index: 1;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: #c8ccd4;
    stroke-width: 1.5;
    transform: translate3d(0, 0, 0);
    transition: all 0.2s ease;
  }
  .check svg path {
    stroke-dasharray: 60;
    stroke-dashoffset: 0;
  }
  .check svg polyline {
    stroke-dasharray: 22;
    stroke-dashoffset: 66;
  }
  .check:hover:before {
    opacity: 1;
  }
  .check:hover svg {
    stroke: #FFC700;
  }
  .cbx:checked + .check svg {
    stroke: #FFC700;
  }
  .cbx:checked + .check svg path {
    stroke-dashoffset: 60;
    transition: all 0.3s linear;
  }
  .cbx:checked + .check svg polyline {
    stroke-dashoffset: 42;
    transition: all 0.2s linear;
    transition-delay: 0.15s;
  }

  .tracking-table__row.selecting {
    padding-left: 80px !important;
  }

  .selecting {
    & .tracking-table__cell.itemWidthImage.itemWidthImage  {
      padding-left: 0px !important;
    }
  }
</style>