<template>
  <div class="tarifes block_container">
    <div class="tarifes__desc">
      <p>Цена при оплате за 3 месяца - скидка 10%, за 6 месяцев - скидка 15%.</p>
    </div>
    <div class="tarifes-tabs">
      <button class="tarifes-tabs__btn" :class="{active: discount === 0}" @click="discount = 0">Ежемесячно</button>
      <button class="tarifes-tabs__btn" :class="{active: discount === 10}" @click="discount = 10">На 3 месяца</button>
      <button class="tarifes-tabs__btn" :class="{active: discount === 15}" @click="discount = 15">На 6 месяцев</button>
    </div>
    <Tariff
      v-for="item in tariffs"
      :key="item.name"
      :old-price="item.oldPrice ? item.oldPrice : 0"
      :price="Math.floor(item.price * (100 - discount)) / 100"
      :clazz="item.clazz"
      :name="item.name"
      :list="item.list"
      :is-buyable="item.isBuyable"
      :isLoaded="isLoaded"
    />
  </div>
</template>

<script>
  import Tariff from "./Tariff";
  import {GET_ALL_SUBSCRIBTIONS} from "@/store/modules/user/constants"

  export default {
    name: "TariffList",
    components: {Tariff},
    data() {
      return {
        discount: 0,
        tariffs: [
          {
            name: "FREE",
            price: 0,
            clazz: "tarif__item_fourth",
            isBuyable: false,
            list: [
              {text: "10 товаров на отслеживании", success: true},
              {text: "20 анализов по категориям", success: true},
              {text: "Скачивание отчётов", error: true},
              {text: "Автоподсорт", error: true},
              {text: "Экспорт поисковой выдачи в XLS", error: true},
              {text: "Возможность выбрать период 7,14,30", error: true},
              {text: "Оповещения об изменениях остатков, цены, отзывов по email", error: true},
              {text: "Ранний доступ к новому функционалу", error: true}
            ]
          },
          {
            name: "PRO",
            price: 990,
            clazz: "tarif__item_fourth",
            isBuyable: true,
            list: [
              {text: "150 товаров на отслеживании", success: true},
              {text: "Безлимит анализов по категориям", success: true},
              {text: "Скачивание отчётов", success: true},
              {text: "Автоподсорт", success: true},
              {text: "Экспорт поисковой выдачи в XLS", success: true},
              {text: "Возможность выбрать период 7 дней", success: true},
              {text: "Оповещения об изменениях остатков, цены, отзывов по email", error: true},
              {text: "Ранний доступ к новому функционалу", error: true}
            ]
          },
          {
            name: "BUSINESS",
            oldPrice: 5000,
            price: 3990,
            clazz: "tarif__item_fourth",
            isBuyable: true,
            list: [
              {text: "500 товаров на отслеживании", success: true},
              {text: "Безлимит анализов по категориям", success: true},
              {text: "Скачивание отчетов", success: true},
              {text: "Автоподсорт", success: true},
              {text: "Экспорт поисковой выдачи в XLS", success: true},
              {text: "Возможность выбрать период 7, 14, 30 дней", success: true},
              {text: "Оповещения об изменениях остатков, цены, отзывов по email", success: true},
              {text: "Ранний доступ к новому функционалу", success: true},
            ]
          },
        ],
        isLoaded: true,
      }
    },
    // async created() {
    //   this.isLoaded = false
    //   const result = await this.$store.dispatch(`user/${GET_ALL_SUBSCRIBTIONS}`)
    //   console.log(result)
    //   result.data.forEach(tariff => {
    //     this.tariffs.find(item => item.name === tariff.type)['id'] = tariff.id
    //     this.tariffs.find(item => item.name === tariff.type)['price'] = tariff.price
    //   });
    //   this.isLoaded = true
    // },
    // methods: {
    //   termsReaded() {
    //     this.termsReadedInput = true
    //   }
    // }
  }
</script>

<style scoped lang="scss">
  .tarifes {
    margin-top: 2.5rem;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    &-tabs {
      flex: 0 0 100%;
      max-width: 100%;
      margin: 0 0 10px 0;
      justify-content: center;
      display: flex;

      &__btn {
        background: none;
        margin-right: 30px;
        padding: 10px 20px;
        font-size: 16px;
        color: #C5C7D2;
        text-transform: uppercase;
        font-weight: 500;
        cursor: pointer;
        border-bottom: 3px solid rgba(255, 200, 0, 0);

        &.active {
          color: #000;
          border-color:#FFC700;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }

    &__desc {
      flex: 0 0 100%;
      max-width: 100%;
      text-align: center;
      margin: 30px 0;
      font-size: 20px;
    }

    @media screen and (max-width: 1300px) {
      justify-content: center;
    }
    @media screen and (max-width: 800px) {
      flex-direction: column;
      margin-top: 1rem;
    }
    @media screen and (max-width: 420px) {
      padding: 0px 10px;
    }
  }
  
</style>