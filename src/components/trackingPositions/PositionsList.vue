<template>
  <div class="tracking-body">
    <div class="tracking-info">
      <div class="tracking-add-product">
        <AddGoodsPositionsBtn/>
      </div>
      <div class="tracking-actions">
        <RowWithIcon/>
      </div>
    </div>

    <TrackingPositionsTable v-if="tablePositions && loaded"
                   :headers="tableHeaders"
                   :items="tablePositions"
                   :order="orderType"
                   :order-handler="$orderHandler"/>

  </div>
</template>

<script>
  import RowWithIcon from "@/shared-components/RowWithIcon";
  import TrackingPositionsTable from "@/shared-components/TrackingPositionsTable";
  // import ProductAction from "@/components/tracking-table/ProductAction";
  import {orderHandler} from "@/extenders/mixins/order_handler";
  // import ProductPrice from "@/components/tracking-table/ProductPrice";
  import {tableMixins} from "@/extenders/mixins/table_mixins";
  import {mapState, mapActions} from "vuex";
  import {POSITION_GETTER} from "@/store/modules/trackingPositions/constants";
  import AddGoodsPositionsBtn from "@/shared-components/AddGoodsPositionsBtn";
  import {LOAD_POSITIONS_ACTION} from "@/store/modules/trackingPositions/constants";
  import {BlackboxService} from "@/services/blackbox_service";

  export default {
    name: "Groups",
    components: {RowWithIcon, TrackingPositionsTable, AddGoodsPositionsBtn},
    // components: {RowWithIcon, AddGoodsPositionsBtn},
    mixins: [orderHandler, tableMixins],
    data() {
      return {
        tableHeaders: [
          {name: 'name', label: 'Наименование товара', clazz: 'mw300', sortable: false},
          {
            name: 'color',
            label: 'Цвет',
            clazz: 'mw200 tracking-table__header-item_align-left',
          },
          {
            name: 'amountOfCategories',
            label: 'Количество категорий',
            clazz: 'mw200 tracking-table__header-item_align-left',
          },
          {
            name: 'revenueOfGoods',
            label: 'Сумма заказов/шт.',
            clazz: 'mw200 tracking-table__header-item_align-center'
          },
          {
            name: 'revenueOfGoodsPrice',
            label: 'Сумма заказов/руб.',
            clazz: 'mw200 tracking-table__header-item_align-center'
          },
          {
            name: 'actions',
            label: 'Действия',
            clazz: 'mw200 tracking-table__header-item_align-right'
          },
        ],

        tablePositions: null,

        orderType: '',

        progress: 0,

        isLoaded: false,

        loaded: false
      };
    },
    computed: {
      ...mapState('trackingPositions', ['positions']),
      mySubscription() {
        return this.$store.getters['user/getSubscription'].subscriptionType
      },
      positions() {
        const positionsByBrand = this.$store.getters[`trackingPositions/${POSITION_GETTER}`]
        if(positionsByBrand.length <= 0) return [];
        const brands = {}
        positionsByBrand.forEach(item => {
          if(!brands[item.brand]) {
            brands[item.brand] = [];
          }
          brands[item.brand].push(item)
        })
        return brands;
      }
    },
    methods: {
      async loadImages() {
        this.tablePositions.forEach(async function (row) {
          const service = new BlackboxService();
          const data = await service.getProductImagePathAndName(row.articul.content);
          row.name.image = data.imageLink
        });
      },
      ...mapActions('trackingPositions', [LOAD_POSITIONS_ACTION]),
    },
    mounted() {
      this.loaded = false
      const positions = [];
          Object.keys(this.positions).forEach(brand => {
            positions.push({
              name: {
                clazz: "tracking-table__align-left mw200",
                content: brand,
                image: ''
              },
            })

            this.positions[brand].forEach(position => {
              return  {
                name: {
                  clazz: "tracking-table__align-left mw200",
                  content: position.name,
                  image: ''
                },
                color: {
                  clazz: "tracking-table__align-left mw200",
                  content: 'В тесте',
                },
                amountOfCategories: {
                  clazz: "tracking-table__align-left mw200",
                  content: position.categories_count,
                },
                revenueOfGoods: {
                  clazz: "tracking-table__align-left mw200",
                  content: position.avOrdersSpeed,
                },
                revenueOfGoodsPrice: {
                  clazz: "tracking-table__align-left mw200",
                  content: position.avRevenue,
                },
                actions: {
                  clazz: "tracking-table__align-left mw200",
                  content: 'Действие',
                },
              }
            })
          })

          this.tablePositions = positions;

          this.loaded = true;
    },
    watch: {
      orderType: function () {
        const positions = this.tablePositions
        if (this.orderType[0] !== '-') {
          positions.sort((prev, next) => prev[this.orderType].content - next[this.orderType].content)
        } else {
          positions.sort((prev, next) => next[this.orderType.substr(1)].content - prev[this.orderType.substr(1)].content)
        }
        this.tablePositions = positions
      }, 
      positions: {
        handler: function () {
          this.loaded = false
          const positions = [];
          Object.keys(this.positions).forEach(brand => {
            positions.push({
              name: {
                clazz: "tracking-table__align-left mw200",
                content: brand,
                image: ''
              },
            })

            this.positions[brand].forEach(position => {
              return  {
                name: {
                  clazz: "tracking-table__align-left mw200",
                  content: position.name,
                  image: ''
                },
                color: {
                  clazz: "tracking-table__align-left mw200",
                  content: 'В тесте',
                },
                amountOfCategories: {
                  clazz: "tracking-table__align-left mw200",
                  content: position.categories_count,
                },
                revenueOfGoods: {
                  clazz: "tracking-table__align-left mw200",
                  content: position.avOrdersSpeed,
                },
                revenueOfGoodsPrice: {
                  clazz: "tracking-table__align-left mw200",
                  content: position.avRevenue,
                },
                actions: {
                  clazz: "tracking-table__align-left mw200",
                  content: 'Действие',
                },
              }
            })
          })

          this.tablePositions = positions;
          // this.loadImages()
          this.loaded = true
        },
        deep: true
      }
    }
  }
</script>


<style scoped lang="scss">
  @import "../../assets/scss/variables";

  .tracking-body {
    background: transparent;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .tracking-table-wrapper {
    flex: 1;
  }

  .tracking-info {
    padding: 1.14rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $drayDevider;
  }

  .tracking-add-product {
    width: 11.85rem;
  }

  .tracking-actions {
    flex: 1 0 auto;
    margin-left: 2.14em;
    display: flex;
    align-items: center;
  }

  @media screen and (max-width: 800px) {
    .tracking-info {
      flex-wrap: wrap;
    }
    .progressBar {
      max-width: 100% !important;
      margin-top: 15px;
    }
  }
</style>