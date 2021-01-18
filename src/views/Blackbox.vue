<template>
  <Fragment>
    <FilterBlock :downloadBtnStatus="downloadBtnStatus" 
                 @downloadSearchResults="downloadSearchResults" 
                 :isLoading="isLoading" 
                 :searchHandler="searchHandler"
                 :days="days"
                 :isHaveToSearch="isHaveToSearch"/>
    <TreeSelect label="Отображаемые колонки"
                v-model="columns"
                :multiple="true"
                :options="columnsItems"
                class="column-selector"/>
    <div class="blackbox">
      <div class="blackbox-days">
        <span 
          v-for="day in daysOption"
          :key="day.title"
          :class="{'active': days === day.value, 'disabled': day.isDisabled}"
          class="blackbox-days-item"
          @click="daysChange(day)">
            {{ day.title }}
        </span>
      </div>
      <TrackingTable v-if="!isLoading && tablePositions.length > 0 && !isLoadingAgregated"
                     :headers="tableHeaders"
                     :items="tablePositions"
                     :order="orderType"
                     :order-handler="$orderHandler"
                     :subheaders="subheaders"
                     :select-all="true"
                     @show-modal="showModalAddToGroup"
                     :after-selecting-title="`Добавить на отслеживание`"/>
      <div v-else-if="isLoading || isLoadingAgregated" class="loading-table">
        <img ondragstart="return false" src="../assets/img/loading.svg" alt="">
      </div>
      <div v-else-if="isLoading === false && tablePositions.length <= 0 && isLoadingAgregated === false && loadedListError" class="table-notFounded">
        <p class="table-notFounded-text">Товары по заданным критериям не найдены</p>
      </div>
    </div>
    <div class="block_container pagination_container" v-if="!isLoading && tablePositions.length > 0 && !isLoadingAgregated">
      <TrackingPagination :total-count="paginationData.totalCount"
                          :page="paginationData.page"
                          :per-page="paginationData.perPage"
                          :per-page-handler="perPageHandler"
                          :prev-handler="$paginationPrevHandler"
                          :next-handler="$paginationNextHandler"/>
    </div>
  </Fragment>
</template>

<script>
  import FilterBlock from "@/components/FilterBlock";
  import {Fragment} from 'vue-fragment';
  import TrackingTable from "@/shared-components/TrackingTable";
  import ProductContent from "@/components/tracking-table/ProductContent";
  import ProductRating from "@/components/tracking-table/ProductRating";
  import {tableMixins} from "@/extenders/mixins/table_mixins";
  import {BlackboxService} from "@/services/blackbox_service";
  import TrackingPagination from "@/shared-components/TrackingPagination";
  import {paginationMixin} from "@/extenders/mixins/pagination_mixin";
  import {debounce} from 'lodash'
  import ProductBlackboxNested from "@/components/tracking-table/ProductBlackboxNested";
  import {SHOW_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import AddToGroup from "@/components/blackbox/AddToGroup";
  import {AmplitudeService} from "../services/amplitude_service";
  import PlusImage from '../assets/img/ikons/plus3.svg';
  import ImgBtn from "../shared-components/ImgBtn";
  import TreeSelect from "@/shared-components/TreeSelect";

  const DEFAULT_ORDER_TYPE = '-avRevenue';

  export default {
    name: "Blackbox",
    components: {TrackingPagination, TrackingTable, FilterBlock, Fragment, TreeSelect},
    mixins: [tableMixins, paginationMixin],
    data() {
      return {
        list: [],

        orderType: DEFAULT_ORDER_TYPE,

        debounceLoadGoods: debounce(this.loadGoods, 200),

        isLoading: null,

        subheaders: {},

        isLoadingAgregated: false,

        downloadBtnStatus: 'hidden',

        days: 7,

        daysOption: [
          {
            title: '7 дн',
            value: 7,
            isDisabled: false,
          },
          {
            title: '14 дн',
            value: 14,
            isDisabled: true,
          },
          {
            title: '30 дн',
            value: 30,
            isDisabled: true,
          },
        ],

        columns: [],

        isHaveToSearch: false,

        cachedSearchResults: null,

        loadedListError: false,

        tableHeaders: [
          {name: 'name', label: 'Товар', clazz: 'width30 mw300', sortable: false},
          {name: 'articul', label: 'Артикул', clazz: 'width9 mw100', isOnlyAscSorting: true},
          {name: 'currentPrice', label: 'Цена', clazz: 'width5 mw100'},
          {name: 'currentQty', label: 'Остаток', clazz: 'width9 mw100'},
          {name: 'avOrdersSpeed', label: 'Заказов в неделю', clazz: 'width9 mw100'},
          {name: 'avRevenue', label: 'Сумма заказов за неделю', clazz: 'width9 mw150'},
          {name: 'currentRating', label: 'Рейтинг', clazz: 'tracking-table__header-item_align-right width23 mw150'},
          {name: 'currentFeedBackCount', label: 'Кол-во отзывов', clazz: 'width9 mw100'},
          {name: 'add', label: 'Добавить в мои товары', sortable: false, clazz: 'width9 mw150'}
        ],

        BlackboxTour: null,
      }
    },
    computed: {
      tablePositions() {
        return this.list.map(item => ({
          ...this.$mapItemListToTableItem(item),
          splicedPrice: item.splicedPrice,
          pk: item.pk,
          nested: {content: ProductBlackboxNested, articul: item.articul, clazz: 'tracking-table-dropdown__item-chart', days: this.days}
        }));
      },
      columnsItems() {
        const columnsItems = []
        const nonDinamicColumns = ['Товар', 'Добавить в мои товары']
        this.tableHeaders.forEach((column, idx) => {
          if(!nonDinamicColumns.find(item => item === column.label)) {
            columnsItems.push({
              label: column.label,
              id: idx
            })
          }
        })
        return columnsItems
      },
      searchID() {
        return this.$store.state.blackbox.searchID;
      },
      agregatedData() {
        return this.$store.state.blackbox.agregated
      },
      userSubscription() {
        return this.$store.state.user.subscription?.subscriptionType;
      },
    },
    methods: {
      showModalAddToGroup(data) {
        this.$store.commit(`modal/${SHOW_MODAL_MUTATION}`, {component: AddToGroup, data})
      },
      async searchHandler() {
        this.isLoading = true
        this.tableHeaders.find(header => header.name === "avOrdersSpeed").label = this.days === 7 ? 'Заказов в неделю' : this.days === 14 ? 'Заказов за две недели' : 'Заказов в месяц';
        this.tableHeaders.find(header => header.name === "avRevenue").label = this.days === 7 ? 'Сумма заказов за неделю' : this.days === 14 ? 'Сумма заказов за две недели' : 'Сумма заказов за месяц';
        this.paginationData.page = 1;
        this.orderType = DEFAULT_ORDER_TYPE;
        this.debounceLoadGoods();
      },
      perPageHandler(value) {
        this.paginationData.page = 1;
        this.paginationData.perPage = value;

        AmplitudeService.blackBoxOnPageData(parseInt(value));

        this.loadGoods();
      },
      prevHandler() {
        this.paginationData.page -= 1;

        this.loadGoods();
      },
      nextHandler() {
        this.isLoading = true

        this.paginationData.page += 1;

        this.loadGoods();
      },

      daysChange(day) {
        if(!day.isDisabled && this.days !== day.value) {
          this.days = day.value;
          if(this.list && this.list.length > 0) {
            this.isHaveToSearch = !this.isHaveToSearch
          }
        }
      },

      async loadGoods() {
        if (this.$store.state.blackbox.searchID) {
          this.list = [];
          this.isLoading = true
          const service = new BlackboxService();

          const result = await service.getGoodsBySearchID(
            this.$store.state.blackbox.searchID,
            this.orderType,
            this.paginationData.page,
            this.paginationData.perPage
          );
    
          this.paginationData.totalCount = result.countAll;

          // Временная разбивка цены, хардкод
          result.products.forEach(product => {
            product.splicedPrice = {
              firstPrice: (product.currentPrice * 0.8).toFixed(),
              secondPrice: (product.currentPrice * 0.2).toFixed()
            }
          })

          this.list = result.products;

          this.cachedSearchResults = result

          this.$nextTick(() => {
            this.isLoading = false
            if(this.BlackboxTour) {
              if(this.BlackboxTour.getCurrentStep().id === 'tour-step-4') {
                setTimeout(() => {
                  this.BlackboxTour.next()
                }, 500);
              }
            }
          })

          if(this.list.length <= 0) {
            this.loadedListError = true
          } else {
            this.loadedListError = false
          }

        }
      },
      async downloadSearchResults() {
        this.downloadBtnStatus = 'loading'
        if (this.$store.state.blackbox.searchID) {
          const service = new BlackboxService();
          const result = await service.downloadSearchResults(
            this.searchID,
            this.orderType
          );
          if(result) {
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Поиск был скачен', status: 'success'})
          } else {
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Произошла ошибка', status: 'error'})
          }
          this.downloadBtnStatus = false
        } else {
          this.downloadBtnStatus = 'hidden'
        }
      },
      insertHeaders(headers) {
        const renamedHeaders = {
          priceAvg: {
            label: "currentPrice",
            title: "Средняя цена",
            value: "₽",
            formatting: true
          },
          qtyAvg: {
            label: "currentQty",
            title: "Cреднее кол-во остатков",
            value: null,
            formatting: true
          },
          qtySum: {
            label: "currentQtySum",
            title: "Общая сумма остатков",
            value: null,
            formatting: true
          },
          orderSum: {
            label: "avOrdersSpeed",
            title: "Кол-во заказов",
            value: null,
            formatting: true
          },
          revenueSum: {
            label: "avRevenue",
            title: "Сумма заказов",
            value: "₽",
            formatting: true
          },
          ratingAvg: {
            label: "currentRating",
            title: "Средний рейтинг",
            value: null,
            formatting: false
          },
          feedbackAvg: {
            label: "currentFeedBackCount",
            title: "Среднее кол-во отзывов",
            value: null,
            formatting: true
          }
        }
        this.subheaders = {}
        Object.keys(renamedHeaders).forEach(header => {
          // this.tableHeaders.find(item => item.name === renamedHeaders[header].label)["subheader"] = renamedHeaders[header].title
          this.subheaders[header] = {}
          this.subheaders[header]["subheader"] = renamedHeaders[header].title
          let subHeaderValue = headers.find(item => item.label === header).value
          if(renamedHeaders[header].formatting) {
            subHeaderValue = subHeaderValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }
          if(typeof subHeaderValue === "number" && !Number.isInteger(subHeaderValue, 1)) {
            subHeaderValue = subHeaderValue.toFixed(2)
          }
          if(renamedHeaders[header].value) {
            subHeaderValue += renamedHeaders[header].value
          }
          this.subheaders[header]["subHeaderValue"] = subHeaderValue
          // this.tableHeaders.find(item => item.name === renamedHeaders[header].label)["subheaderValue"] = subHeaderValue
        })
      },
      map_name(item) {
        return {
          content: ProductContent,
          clazz: 'width30 itemWidthImage',
          component_data: {goodsName: item.name, articul: item.articul, brand: item.brand, link: item.link, imagePath: item.image_link}
        };
      },
      map_currentPrice(item) {
        return {content: `${item.currentPrice} ₽`, clazz: 'width5'};
      },
      map_currentRating(item) {
        return {content: ProductRating, component_data: {rating: item.currentRating}, clazz: 'width9'};
      },
      map_add(item) {
        return {
          content: ImgBtn, component_data: {
            src: PlusImage,
            'click-handler': this.addGoodsPositionHandler.bind(this, item)
          }, clazz: 'tracking-table__align-right width9'
        }
      },
      addGoodsPositionHandler(item) {
        this.$store.commit(`modal/${SHOW_MODAL_MUTATION}`, {component: AddToGroup, data: {articul: item.articul}})
      }
    },
    async mounted() {
      this.$initPaginationHandlers(this.prevHandler, this.nextHandler);
    },
    beforeDestroy() {
      const _data = {...this.$data}
      delete _data.debounceLoadGoods;
      this.$store.commit('blackbox/saveSearchResultsLocal', _data)
    },
    created() {
      const myLocalSearchResults = this.$store.getters['blackbox/myLocalSearchResults']
      if(myLocalSearchResults) {
        Object.keys(myLocalSearchResults).forEach(key => {
          if(key !== 'paginationData') {
            this.$nextTick(() => {
              this[key] = myLocalSearchResults[key]
            })
          } else {
            this.paginationData.page = myLocalSearchResults[key].page
            this.paginationData.perPage = myLocalSearchResults[key].perPage
            this.paginationData.totalCount = myLocalSearchResults[key].totalCount
          }
        })
        if(myLocalSearchResults.cachedSearchResults) {
          this.paginationData.totalCount = myLocalSearchResults.cachedSearchResults.countAll;
        }
      }

      if(this.userSubscription === 'BUSINESS') {
        this.daysOption.forEach(day => {
          if(day.value === 14) {
            day.isDisabled = false
          } else if(day.value === 30) {
            day.isDisabled = false
          }
        })
      }

      for(let i = 0; i < this.columnsItems.length; i++) {
        this.columns.push(this.columnsItems[i].id)
      }
    },
    watch: {
      searchID: function () {
        if(this.searchID) {
          this.downloadBtnStatus = false
        }
      },
      orderType: function () {
        AmplitudeService.blackBoxOrdering(this.orderType);
        this.debounceLoadGoods();
      },
      agregatedData: {
        handler: function () {
          this.$nextTick(() => {
            const result = this.agregatedData
            const mainInfo = ['onPage', 'products', "countAll"]
            const potentialHeaders = []
            Object.keys(result).forEach(resultItem => {
              if(!mainInfo.find(resultPotentialItem => resultPotentialItem === resultItem)) {
                potentialHeaders.push({label: resultItem, value: result[resultItem]})
              }
            })
            if(potentialHeaders.length > 0) {
              this.insertHeaders(potentialHeaders)
            }
          })
        },
        deep: true
      },
      columns: function () {
        if(this.list.length > 0) {
          this.isLoading = true
        }
        const nonDinamicColumns = ['Товар', 'Добавить в мои товары']
        this.tableHeaders.forEach(column => {
          if(!nonDinamicColumns.find(item => item === column.label)) {
            column.status = 'hidden'
          }
        })
        this.columns.forEach(id => {
          const columnName = this.columnsItems.find(item => item.id === id).label
          this.tableHeaders.find(header => header.label === columnName).status = `show`
        })
        if(this.list.length > 0 && this.isLoading) {
          this.$nextTick(() => {
            this.isLoading = false
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/scss/variables";

  .blackbox {
    margin: 2.28rem 2.28rem 0;
    background: white;
    border: 1px solid $drayDevider;
    flex: 1;
    position: relative;
    min-height: 200px;
    &-days {
      position: absolute;
      right: 0px;
      top: -25px;
      // @media screen and(max-width: 450px) {
      //   top: -70px;
      // }
      &-item {
        margin: 0px 5px;
        font-weight: bold;
        color: #9FA2B4;
        cursor: pointer;
        user-select: none;
        &.active {
          border-bottom: 1px solid #9FA2B4;
        }
        &.disabled {
          cursor: default;
          color:rgba(159, 162, 180, .5);
          position: relative;
          &:after {
            opacity: 0;
            content: "Business";
            border-radius: 12px;
            background: #FFC700;
            color: #000;
            font-size: 12px;
            padding: 4px 9px;
            display: block;
            top: -15px;
            left: 50%;
            transform: translate(-50%, -50%);
            position: absolute;
            font-weight: 300;
            text-transform: uppercase;
          }
          &:hover:after {
            opacity: 1;
          }
        }
      }
    }
  }

  .blackbox-navigation {
    display: flex;
    margin: 2.28rem 2.28rem 0;
  }

  .blackbox-navigation-wrapper {
    overflow: auto hidden;
    display: flex;
    flex-direction: column;
  }

  .pagination_container {
    margin-bottom: 5.71rem;
  }

  .column-selector {
    margin: 1.42rem 2.28rem 0;
    @media screen and(max-width: 710px) {
      margin: 10px;
    }
  }

  .loading-table {
    flex: 1;
    background: #fff;
    box-sizing: border-box;
    width: 100%;
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
  @media screen and (max-width: 710px) {
    .blackbox {
      margin-left: 10px;
      margin-right: 10px;
      min-height: 140px;
    }
    .blackbox-navigation {
      margin-left: 10px;
      margin-right: 10px;
    }
  }
</style>