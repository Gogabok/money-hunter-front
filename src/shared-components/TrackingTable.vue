<template>
  <div class="tracking-table-wrapper">
    <tr v-if="subheaders && isLoadedAtLeastOnce" class="tracking-table__header tracking-table__header-subheader">
      <th v-for="item in subheaders" :key="item.name" class="tracking-table__header-item" :class="item.clazz || ''">
        <span v-if="item.subheader && item.subHeaderValue !== false" class="tracking-table__header-item-subheader">{{ item.subheader }}: <span>{{ item.subHeaderValue }}</span></span>
      </th>
    </tr>
    <div v-if="selectAll && isLoadedAtLeastOnce" class="selectAll-folder" :class="isSelecting ? `allSelecting` : ''">
      <input @input="selectAllCheckboxMethod" v-model="selectAllCheckbox" type="checkbox" :id="'allSelect'" class="cbx" style="display: none;">
      <label v-if="isSelecting" :for="'allSelect'" class="check">
        <svg width="18px" height="18px" viewBox="0 0 18 18">
          <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
          <polyline points="1 9 7 14 15 4"></polyline>
        </svg>
      </label>
      <Btn 
        without-default-class
        class="tracking-table-wrapper-button"
        :class="isSelecting ? 'active' : ''" 
        @click="selectItems"
        :label="!isSelecting ? 'Выбрать товары' : afterSelectingTitle"
      />
      <Btn without-default-class
           label="Экспорт в csv"
           :clazz="`filter-form__action-button 
           filter-form__action-button_saveSearchResult
           ${downloadBtnStatus}`"
           :loading="downloadBtnStatus === 'loading'"
           v-if="downloadSearchCSV"
           @click="$emit('downloadSearchResults')"/>

      <TreeSelect v-if="columnsSelector"
                @input="$emit('selectColumn', $event)"
                :value="columns"
                :multiple="true"
                :options="columnsOptions"
                :limit="3"
                :limitText="count=>`и еще ${count}`"
                class="column-selector"/>
    </div>
    <table v-if="isLoadedAtLeastOnce" class="tracking-table tracking-table_sticky" ref="HeaderScroll" v-on:scroll="handleHeaderScroll">
      <tbody class="tracking-table-tbody">
        <tr :class="isSelecting ? `selecting` : ''" class="tracking-table__header">
          <th v-for="item in headers" :key="item.name" class="tracking-table__header-item" :class="{[item.clazz]: item.clazz, [item.status]: item.status }|| ''">
            <div>
              <span :class="{'tracking-table__header-label': isSortable(item)}"
                    @click="headerClickHandler(item)" v-html="item.label"></span>
              <Btn v-if="isSortable(item) && getSortClass(item)"
                  @click="headerClickHandler(item)"
                  without-default-class
                  :clazz="`tracking-table__sort ${getSortClass(item)}`"/>
            </div>
            <!-- <span v-if="item.subheader && item.subheaderValue" class="tracking-table__header-item-subheader">{{ item.subheader }}: <span>{{ item.subheaderValue }}</span></span> -->
          </th>
        </tr>
      </tbody>
    </table>
    <table class="tracking-table" id="tracking-table" v-if="items.length>0 && !isLoading && !isLoadingAgregated" ref="BodyScroll" v-on:scroll="handleBodyScroll">
      <!-- {{ items[0].currentPrice.component_data.price }} -->
      <TrackingTableRow 
        :selectedItems="selectedItems" 
        @selectItemsMethod="selectItemsMethod" 
        :isSelecting="isSelecting" 
        :row-data="item" 
        :header-keys="headers.map(h=>h.name)" 
        :headerWidth="headers" 
        :index="idx" 
        v-for="(item, idx) in items" 
        :key="idx"
        @close-other-tabs="closeOtherTabsHandler"
        :openRowIndex="openRowIndex"
      />
    </table>
    <div v-else-if="isLoading || isLoadingAgregated" class="loading-table">
      <img ondragstart="return false" src="../assets/img/loading.svg" alt="">
    </div>
    <div v-else-if="isLoading === false && items.length <= 0 && isLoadingAgregated === false && loadedListError" class="table-notFounded">
      <p class="table-notFounded-text">Товары по заданным критериям не найдены</p>
    </div>
  </div>
</template>

<script>
  import Btn from "@/shared-components/Btn";
  import TrackingTableRow from "@/shared-components/TrackingTableRow";
  import TreeSelect from "@/shared-components/TreeSelect";

  export default {
    name: "TrackingTable",
    components: {TrackingTableRow, Btn, TreeSelect},
    props: {
      headers: {
        type: Array,
        required: true
      },
      items: {
        type: Array,
        required: true,
      },
      order: {
        type: String,
        required: false,
      },
      orderHandler: {
        type: Function,
        required: false,
      },
      subheaders: {
        type: [Object, Array],
        required: false
      },
      selectAll: {
        type: Boolean
      },
      afterSelectingTitle: {
        type: String
      },
      isLoading: {
        type: Boolean
      },
      isLoadingAgregated: {
        type: Boolean
      },
      downloadSearchCSV: {
        type: Boolean,
        default: false
      },
      downloadBtnStatus: {
        type: [String, Boolean],
        required: false
      },
      columnsSelector: {
        type: Boolean,
        default: false
      },
      columnsOptions: {
        type: [Array, Boolean],
        default: false
      },
      columns: {
        type: [Array, Boolean],
        default: false
      }
    },
    data() {
      return {
        isSelecting: false,
        selectedItems: [],
        selectAllCheckbox: false,
        openRowIndex: null,
        isLoadedAtLeastOnce: false,
        columnsModel: []
      }
    },
    computed: {
      // subheaders() {
      //   return this.headers.filter(item => item.subheader)
      // }
    },
    watch: {
      isLoading: function () {
        if(this.items.length > 0) {
          this.isLoadedAtLeastOnce = true
        }
      },
      columnsModel: function () {
        if(this.columnsModel !== this.columns) {
          this.$emit('selectColumn', this.columnsModel)
        }
      },
      columns: function () {
        if(this.columns !== this.columnsModel) {
          this.columnsModel = this.columns
        }
      }
    },
    created() {
      console.log(this.items[0])
    },
    methods: {
      downloadSearchResults() {
        this.$emit('downloadSearchResults')
      },
      handleHeaderScroll() {
        this.$refs.BodyScroll.scrollLeft = this.$refs.HeaderScroll.scrollLeft
      },
      handleBodyScroll() {
        this.$refs.HeaderScroll.scrollLeft = this.$refs.BodyScroll.scrollLeft
      },
      isSortable(item) {
        return item.sortable || item.sortable === undefined;
      },
      getSortClass(item) {
        if (this.order === `-${item.name}`) return 'tracking-table__sort_up';
        if (this.order === item.name) return 'tracking-table__sort_down';
        return null;
      },
      headerClickHandler(item) {
        if (this.order === item.name && item.isOnlyAscSorting) {
          return;
        }
        if (this.isSortable(item)) {
          this.orderHandler(item.name);
        }
      },
      selectItems() {
        if(this.isSelecting) {
          if(this.selectedItems.length > 0) {
            const selectedArticules = []
            this.selectedItems.forEach(item => {
              const content = this.items[item].articul?.content || this.items[item].nested?.articul
              selectedArticules.push(content)
            })
            this.$emit('show-modal', {articul: selectedArticules})
          } else {
            this.isSelecting = false
          }
        } else {
          this.isSelecting = true
        }
      },
      selectItemsMethod(idx) {
        if(this.selectedItems.indexOf(idx) <= -1) {
          this.selectedItems.push(idx) 
        } else {
          this.selectedItems.splice(this.selectedItems.findIndex(item => item === idx), 1)
        }
      },
      selectAllCheckboxMethod() {
        this.$nextTick(() => {
          if(!this.selectAllCheckbox) {
            this.items.forEach((item, idx) => {
              this.selectedItems.push(idx)
            })
          } else {
            this.selectedItems = []
          }
        })
      },
      closeOtherTabsHandler(index) {
        this.openRowIndex = null;
        this.$nextTick(() => {
          this.openRowIndex = index;
        });
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "../assets/scss/variables";

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

  .hidden {
    display: none !important;
  }

  // .width5{
  //   width: 5%;
  // }

  // .width9{
  //   width: 9%;
  // }

  // .width23{
  //   width: 23%;
  // }

  // .width30 {
  //   width: 30%;
  // }

  // .width10 {
  //   width: 10%;
  // }

  // .width25 {
  //   width: 100%;
  // }

  .tracking-table-wrapper {
    flex: 1;
    box-sizing: border-box;
    position: relative;
    & * {
      box-sizing: border-box;
    }
    // width: 1500px !important;
  }

  .tracking-table {
    width: 100%;
    border-spacing: 0;
    & * {
      box-sizing: border-box;
    }

    &-tbody {
      display: flex;
      flex-direction: column;
      @media screen and (max-width: 1420px) {
        min-width: 1250px;
        max-width: 1250px;
      }
    }

    &.tracking-table_sticky {
      position: sticky;
      max-width: 100%;
      width: 100%;
      top: -1px;
      z-index: 2;
      overflow-x: hidden !important;
      background: white;
      @media screen and (max-width: 568px) {
        & {
          top: 60px;
        }
      }
    }
  }

  .tracking-table__header {
    position: sticky;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    top: -1px;
    width: 100%;
    // padding: 0px 10px;
    padding: 0px;
    min-width: 910px;
    // height: 95px;
  }

  .tracking-table__header-subheader {
    position: static;
    display: flex;
    justify-content: center;
    // max-width: 100%;
    min-width: auto !important;
    & .tracking-table__header-item {
      min-width: 120px;
      border-bottom: 1px solid #DFE0EB;
      padding: 10px 5px !important;
      margin: 0px 5px;
    }
    @media screen and (max-width: 1615px) {
      // justify-content: flex-start;
      // overflow-x: scroll;
      padding-bottom: 5px;
    }
    @media screen and (max-width: 1080px) {
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 5px 10px;
      & .tracking-table__header-item {
        width: 140px;
        margin: 10px 10px;
        justify-content: flex-start;
        text-align: left;
        & .tracking-table__header-item-subheader {
          font-size: 14px;
          line-height: 1.2;
          text-align: left;
          height: 50px;
          & span {
            font-size: 15px;
            text-align: left;
          }
        }
      }
    }
    @media screen and (max-width: 1080px) {
      justify-content: center;
    }
  }

  .tracking-table__header-label {
    cursor: pointer;
  }

  .tracking-table__header-item {
    text-align: right;
    // padding: 1.85rem 1.21rem;
    // padding: 10px 10px 10px 5px;
    padding: 10px 5px;
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    line-height: 1;
    &.pl-15 {
      padding-left: 25px !important;
    }
    &.pr-15 {
      padding-right: 25px !important;
    }
    & * {
      text-align: right;
      
        justify-content: flex-end;
    }
    & div {
      // height: 40px
    }

    &.tracking-table__header-item_align-center {

      div {
        justify-content: center;
      }
    }

    &.tracking-table__header-item_align-left {

      div {
        justify-content: flex-start;
      }
    }

    &.tracking-table__header-item_align-right {

      div {
        justify-content: flex-end;
      }
    }

    &:first-child {
      padding-left: 35px;
      justify-content: flex-start;
      & * {
        justify-content: flex-start;
      }
    }

    &:last-child {
      padding-right: 15px;
    }

    // &:first-child {
    //   padding-left: 1.64rem;
    // }

    // &:last-child {
    //   padding-right: .78rem;
    // }

    div {
      display: flex;
      align-items: center;
      width: 100%;
    }

    span {
      color: $titleColor;
      letter-spacing: .2px;
      // line-height: 1rem;
      font-weight: 500;
    }
    .tracking-table__header-item-subheader {
      font-weight: 300;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      line-height: .8;
      font-size: 12px;
      height: 35px;
      & span {
        color: #000;
        font-weight: 500;
        display: block;
        line-height: 1;
        font-size: 14px;
      }
    }
  }

  .tracking-table__sort {
    flex: 0 0 1.14rem;
    height: 1.14rem;
    margin-left: .42rem;

    &.tracking-table__sort_down {
      background: url("../assets/img/ikons/sort-down.svg") no-repeat;
    }

    &.tracking-table__sort_up {
      background: url("../assets/img/ikons/sort-up.svg") no-repeat;
    }
  }

  @media screen and (max-width: 1400px) {
      .tracking-table__header-label {
        font-size: 12px;
        line-height: 12px;
      }
      .tracking-table__header-item {
        font-size: 12px !important;
        line-height: 12px;
      }
    }
  @media screen and (max-width: 1615px) {
    .tracking-table-wrapper {
      & .tracking-table {
        overflow-x: scroll;
        max-width: 100%;
        width: 100%;
        display: block;
      }
    }
  }

  .selecting {
    padding-left: 80px;
    & .tracking-table__header-item {
      &:first-child {
        padding-left: 0px;
      }
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

  .allSelecting {
    padding-left: 80px;
  }

  .selectAll-folder {
    display: flex;
    align-items: center;
    position: relative;
    border-bottom: 1px solid #DFE0EB;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .loading-table {
    flex: 1;
    background: rgba(255, 255, 255, .6);
    box-sizing: border-box;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
  }

  .loading-table img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .table-notFounded {
    flex: 1;
    background: #fff;
    box-sizing: border-box;
    width: 100%;
  }

  .table-notFounded-text {
    font-size: 1.71rem;
    font-weight: bold;
    letter-spacing: .3px;
    color: black;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    @media screen and (max-width: 768px) {
      font-size: 1.41rem;
    }
    @media screen and (max-width: 550px) {
      font-size: 1.2rem;
    }
  }

  .tracking-table-wrapper-button {
    border: 1px solid $drayDevider;
    border-radius: 4px;
    color: #000;
    padding-left: 1rem;
    padding-right: 1rem;
    height: 2.57rem;
    background: #fff;
    max-width: 200px; 
    margin: 5px;
    &.active {
      background: #FFC700;
      border: none;
    }
  }

  .filter-form__action-button {
    border: 1px solid $drayDevider;
    border-radius: 4px;
    color: #000;
    padding-left: 2.28rem;
    padding-right: 1rem;
    height: 2.57rem;

    &.filter-form__action-button_download {
      background: url("../assets/img/ikons/download2.svg") no-repeat .92rem center, white;
    }

    &.filter-form__action-button_saveSearchResult {
      width: 140px;
      background: url("../assets/img/ikons/save.svg") no-repeat .85rem center, white;
      &.loading {
        background: #fff;
        padding-left: 0px;
        padding-right: 0px;
        cursor: default;
      }
    }
  }

  .column-selector {
    margin-left: auto;
    margin-right: 5px;
    max-width: 500px;
  }
</style>