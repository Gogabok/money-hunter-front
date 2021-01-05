<template>
  <Fragment>
    <div class="tables">
      <table class="tracking-table-dropdown__table sizesTable">
        <tr class="tracking-table-dropdown__header">
          <th class="tracking-table-dropdown__header-item">Размер</th>
          <th class="tracking-table-dropdown__header-item">Остаток</th>
          <th class="tracking-table-dropdown__header-item textAlignLeft">Скорость продаж за последние <br/>14 дней</th>
          <th class="tracking-table-dropdown__header-item">Товара хватит на</th>
        </tr>
        <tr class="tracking-table-dropdown__row" v-for="item in sortedSizes" :key="item.key">
          <td class="tracking-table-dropdown__cell">{{item.key}}</td>
          <td class="tracking-table-dropdown__cell">{{item.value}}</td>
          <td class="tracking-table-dropdown__cell" v-if="sizes[item.key].supply_info">{{sizes[item.key].supply_info.orders_speed}}</td>
          <td class="tracking-table-dropdown__cell" v-else>Доступно на тарифе BUSINESS</td>
          <td class="tracking-table-dropdown__cell" v-if="sizes[item.key].supply_info">{{sizes[item.key].supply_info.days_on_sales}} дней</td>
          <td class="tracking-table-dropdown__cell" v-else>Доступно на тарифе BUSINESS</td>
        </tr>
      </table>

      <table class="tracking-table-dropdown__table raitingTable">
        <tr class="tracking-table-dropdown__header">
          <td class="tracking-table-dropdown__header-item tracking-table-dropdown__cell_strong">Цена</td>
          <td class="tracking-table-dropdown__header-item">{{rating.noSalePrice}} ₽</td>
        </tr>
        <tr class="tracking-table-dropdown__row">
          <td class="tracking-table-dropdown__cell tracking-table-dropdown__cell_strong">Цена со скидкой</td>
          <td class="tracking-table-dropdown__cell">{{priceWithDiscount}} ₽</td>
        </tr>
        <tr class="tracking-table-dropdown__row">
          <td class="tracking-table-dropdown__cell tracking-table-dropdown__cell_strong tracking-table-dropdown__cell_border">
            Всего отзывов
          </td>
          <td class="tracking-table-dropdown__cell tracking-table-dropdown__cell_border">{{rating.feedBackCount}}</td>
        </tr>
        <tr class="tracking-table-dropdown__row">
          <td class="tracking-table-dropdown__cell">
            <ProductRating :rating="5" :total-amount="5"/>
          </td>
          <td class="tracking-table-dropdown__cell">{{rating.fiveStars}}</td>
        </tr>
        <tr class="tracking-table-dropdown__row">
          <td class="tracking-table-dropdown__cell">
            <ProductRating :rating="4" :total-amount="5"/>
          </td>
          <td class="tracking-table-dropdown__cell">{{rating.fourStars}}</td>
        </tr>
        <tr class="tracking-table-dropdown__row">
          <td class="tracking-table-dropdown__cell">
            <ProductRating :rating="3" :total-amount="5"/>
          </td>
          <td class="tracking-table-dropdown__cell">{{rating.threeStars}}</td>
        </tr>
        <tr class="tracking-table-dropdown__row">
          <td class="tracking-table-dropdown__cell">
            <ProductRating :rating="2" :total-amount="5"/>
          </td>
          <td class="tracking-table-dropdown__cell">{{rating.twoStars}}</td>
        </tr>
        <tr class="tracking-table-dropdown__row">
          <td class="tracking-table-dropdown__cell">
            <ProductRating :rating="1" :total-amount="5"/>
          </td>
          <td class="tracking-table-dropdown__cell">{{rating.oneStar}}</td>
        </tr>
      </table>
    </div>

    <div class="chartsWrapper">
      <ProductBlackboxNested :articul="articul"/>
    </div>
  </Fragment>
</template>

<script>
  import ProductRating from "@/components/tracking-table/ProductRating";
  import {Fragment} from 'vue-fragment';
  import ProductBlackboxNested from "@/components/tracking-table/ProductBlackboxNested";
  import {TrackingService} from "@/services/tracking_service";

  export default {
    name: "ProductNestedSizesTable",
    components: {ProductBlackboxNested, ProductRating, Fragment},
    props: {
      articul: {
        type: String,
        required: true
      },
      groupName: {
        type: String,
        required: true,
      },
      priceWithDiscount: {
        type: Number,
        required: true
      },
      pk: {
        type: Number,
        required: true
      },
      groupPK: {
        type: Number,
        required: true
      },
    },
    data() {
      return {
        rating: {},
        sizes: {},
      }
    },
    computed: {
      sortedSizes() {
        console.log(this.sizes)
        return Object.keys(this.sizes).map(key => ({key, value: this.sizes[key].name, supply_info: key.supply_info})).sort((a, b) => b.key - a.key);
      }
    },
    methods: {
      async loadRatingAndSizes() {
        const service = new TrackingService();
        const data = await service.getRatingAndSizes(this.groupPK, this.pk);

        console.log(data)
        this.rating = data.rating_block || {};
        this.sizes = data.sizes_block || {};
      }
    },
    created() {
      this.loadRatingAndSizes();
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/scss/variables";

  table {
    border-spacing: 0;
  }

  .tracking-table-dropdown__table {
    border: 1px solid $iconColor;
  }

  .tracking-table-dropdown__header-item,
  .tracking-table-dropdown__cell {
    padding: 0 1rem;
    line-height: 2.14rem;
    letter-spacing: .2px;
    border-right: 1px solid $iconColor;

    &:last-child {
      border-right: none;
    }
  }

  .tracking-table-dropdown__header-item {
    background: rgba(197, 199, 205, 0.3);
    line-height: 1.3;
    max-width: 150px;
    padding-top: 5px;
    padding-bottom: 5px;

    &.textAlignLeft {
      text-align: left;
    }
  }

  .tracking-table-dropdown__row {

    &:nth-child(odd) {

      .tracking-table-dropdown__cell {
        background: rgba(197, 199, 205, 0.3);
      }
    }
  }

  .tracking-table-dropdown__cell_strong {
    font-weight: 500;
  }

  .tracking-table-dropdown__cell_border {
    border-top: 1px solid $iconColor;
  }

  .sizesTable {
    min-width: 300px;
    margin-bottom: 10px;
    margin-right: 10px;
  }

  .raitingTable {
    min-width: 205px;
  }

  .tables {
    display: flex;
    flex-wrap: wrap;
    margin-right: auto;
  }
  .chartsWrapper {
    margin-right: auto;
    padding-right: 10px;
  }
</style>