<template>
  <div class="tarif__item" :class="clazz">
    <div class="tarif__name">{{name}}</div>
    <div class="tarif-list">
      <div class="tarif-list__item"
           v-for="item in list"
           :key="item.text"
           :class="{'tarif-list__item_success': item.success, 'tarif-list__item_error': item.error}">
        <span class="tarif-list__text">{{item.text}}</span>
        <button class="tarif-list__button" v-if="item.custom"></button>
      </div>
    </div>
    <template v-if="isBuyable">
      <div class="tariff-price"> 
        <span class='tariff-price-actual'>{{price}} ₽</span>
        <div class="tariff-price-desc">
          <span class="tariff-price-desc-oldPrice" v-if="oldPrice > 0">{{ oldPrice }} ₽</span>
          <div class="tariff-price-desc-at">в месяц</div>
        </div>
      </div>
      <Btn label="Купить" :isDisabled="!termsReaded" @click="handleBuyBtn"/>
    </template>
    <template v-if="isBuyable">
      <label class="tariff-list__item-label" :for="name">
        <input v-model="termsReaded" :id="name" type="checkbox">
        <span class="tariff-list__item-label-text">С условием <span @click="showOffer">оферты</span> ознакомлен</span>
      </label>
    </template>
  </div>
</template>

<script>
  import Btn from "../shared-components/Btn";
  import {AmplitudeService} from "@/services/amplitude_service";
  import {GET_PAYMENT_LINK_ACTION} from "@/store/modules/user/constants";
  import {mapActions, mapMutations} from "vuex";
  import {SHOW_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import Warning from "@/components/blackbox/Warning";
  import OfferModal from "@/components/OfferModal";

  export default {
    name: "Tariff",
    components: {Btn},
    data: () => ({
      termsReaded: false
    }),
    props: {
      clazz: {
        type: String,
        default: '',
      },
      name: {
        type: String,
        required: true,
      },
      oldPrice: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      list: {
        type: Array,
        required: true
      },
      isBuyable: {
        type: Boolean,
        default: true
      },
      id: {
        type: Number, 
        default: 2
      }
    },
    methods: {
      async handleBuyBtn() {
        AmplitudeService.subscription(this.name);

        const results = await this[GET_PAYMENT_LINK_ACTION](this.id)
        const response = results.response

        if(response) {
          if(response.status === 400) {
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: response.data.detail, status: 'error'})
          } else if(response.status === 500) {
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Произошла ошибка', status: 'error'})
          }
        } else {
          if (results.status === 200) {
            window.open(results.data.detail)
          }
        }
      },
      showOffer() {
        this.termsReaded = !this.termsReaded
        this[SHOW_MODAL_MUTATION]({component: OfferModal});
      },
      ...mapActions('user', [GET_PAYMENT_LINK_ACTION]),
      ...mapMutations('modal', [SHOW_MODAL_MUTATION])
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/scss/variables";

  .tarif__item {
    flex-basis: calc((100% - (4.28rem * 2)) / 3);
    background: white;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    padding: 1.78rem 2.14rem 2.14rem;
    margin: 30px 0px 0px 0px;

    &:not(:first-child) {
      margin-left: 2rem;
    }

    &.tarif__item_fourth {
      flex-basis: calc((100% - (2.21rem * 3)) / 4);
    }
    @media screen and (max-width: 1300px) {
      &.tarif__item_fourth {
        flex-basis: calc((100% - (2.21rem * 3)) / 2);
      }
    }
    @media screen and (max-width: 800px) {
      &.tarif__item_fourth {
        margin-top: 1.5rem;
      }
      &:not(:first-child) {
        margin-left: 0;
      }
    }
  }

  .tarif__name {
    text-transform: uppercase;
    text-align: center;
    font-size: 1.71rem;
    letter-spacing: .3px;
    font-weight: bold;
    color: black;
  }

  .tarif-list {
    margin-top: 1.28rem;
  }

  .tariff-list__item-label {
    margin-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    &-text {
      margin-left: 5px;
      cursor: pointer;
      line-height: 1;
      display: inline;
      & span {
        color: rgba(55, 81, 255, .8);
        text-decoration: underline;
        &:hover {
          color: rgba(55, 81, 255, 1);
        }
      }
    }
  }

  .tarif-list__item {
    border-top: 1px solid $drayDevider;
    padding: .64rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 3.57rem;

    &:last-child {
      border-bottom: 1px solid $drayDevider;
    }

    &.tarif-list__item_success {
      background: url("../assets/img/ikons/success.svg") no-repeat 100% center;
      padding-right: 2.14rem;
    }

    &.tarif-list__item_error {
      background: url("../assets/img/ikons/error.svg") no-repeat 100% center;
      padding-right: 2.14rem;
    }
  }

  .tarif-list__text {
    font-weight: 500;
    letter-spacing: .3px;
    color: black;
  }

  .tarif-list__button {
    width: 1.42rem;
    height: 1.42rem;
    background: url("../assets/img/ikons/plus.svg") no-repeat;
  }

  .tariff-price {
    display: flex;
    // justify-content: center;
    margin: 1.61rem 0;
    &-actual {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      color: $blue;
      font-size: 2.1rem;
      font-weight: bold;
      letter-spacing: .3px;
      line-height: 1;
    }
    &-desc {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      &-oldPrice {
        text-decoration: line-through;
        text-decoration-color: #000;
        color: #ccc;
        font-weight: bold;
        display: block;
        line-height: 1;
        font-size: 16px;
      }
      &-at {
        font-size: 14px;
        display: block;
        color: #ccc;
        line-height: 1;
      }
    }
  }
</style>