<template>
  <div class="tarifes block_container">
    <div class="tarifes-tabs">
      <button class="tarifes-tabs__btn" :class="{active: discount === 0}" @click="discount = 0">Ежемесячно</button>
      <button class="tarifes-tabs__btn" :class="{active: discount === 10}" @click="discount = 10">На 3 месяца <span>Скидка 10%</span></button>
      <button class="tarifes-tabs__btn" :class="{active: discount === 15}" @click="discount = 15">На 6 месяцев <span>Скидка 15%</span></button>
    </div>
    <Tariff
      v-for="item in tariffs"
      :key="item.name"
      :old-price="item.oldPrice ? item.oldPrice : 0"
      :price="item.priceSale ? item.priceSale : Math.round(Math.floor(item.price * (100 - discount)) / 100)"
      :saleInfo="item.saleInfo"
      :perPeriod="(discount / 5) - 1"
      :id="item.id ? item.id : 0"
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
              {text: "20 запросов к статистике по всем товарам", success: true},
              {text: "Отображение данных за период 7 дней", success: true},
              {text: "Скачивание отчётов", error: true},
              {text: "Расчёт поставок (beta)", error: true},
              {text: "Экспорт поисковой выдачи в XLS", error: true},
              {text: "Оповещения об изменениях остатков, цены, отзывов по email", error: true},
              {text: "Ранний доступ к новому функционалу", error: true}
            ]
          },
          {
            name: "PRO",
            price: 990,
            clazz: "tarif__item_fourth",
            isBuyable: true,
            id: 2,
            list: [
              {text: "150 товаров на отслеживании", success: true},
              {text: "Безлимитные запрос к статистике по всем товарам", success: true},
              {text: "Отображение данных за период 7 дней", success: true},
              {text: "Скачивание отчётов", success: true},
              {text: "Расчёт поставок (beta)", success: true},
              {text: "Экспорт поисковой выдачи в XLS", success: true},
              {text: "Оповещения об изменениях остатков, цены, отзывов по email", error: true},
              {text: "Ранний доступ к новому функционалу", error: true}
            ]
          },
          {
            name: "BUSINESS",
            oldPrice: 5000,
            price: 3990,
            priceSale: 2450,
            saleInfo: {
              saleAmount: "-51%",
              saleDesc: "до 10.01.2020"
            },
            clazz: "tarif__item_fourth",
            isBuyable: true,
            id: 5,
            list: [
              {text: "500 товаров на отслеживании", success: true},
              {text: "Безлимитные запрос к статистике по всем товарам", success: true},
              {text: "Отображение данных за период 30 дней", success: true},
              {text: "Скачивание отчетов", success: true},
              {text: "Расчёт поставок (beta)", success: true},
              {text: "Экспорт поисковой выдачи в XLS", success: true},
              {text: "Оповещения об изменениях остатков, цены, отзывов по email", success: true},
              {text: "Ранний доступ к новому функционалу", success: true},
            ]
          },
        ],
        isLoaded: true,
      }
    },
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
        padding: 10px 20px 5px 20px;
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

        & span {
          display: block;
          text-align: center;
          font-size: 14px;
          text-transform: none;
          font-weight: 400;
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