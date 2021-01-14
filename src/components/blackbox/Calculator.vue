<template>
  <Modal class="modal" :clazz="'large_modal'" title="Калькулятор прибыли" closable>
    <template v-slot:default>
      <div class="modal-wrapper">
        <form v-if="loaded" action="" class="modal-form">
          <div class="modal-wrapper_product">
            <AsyncImg :src="product.imagePath" v-if="product.imagePath" class="modal-wrapper_product-photo"/>
            <span class="modal-wrapper_product-title" v-if="product.goodsName">{{ product.goodsName }}</span>
          </div>
          <div class="modal-wrapper-inputs">
            <div class="modal-wrapper-inputs-part">
              <input-field
                :label="inputs[0].title"
                v-model="inputs[0].value"
                :symbol="inputs[0].symbol"
                :disabled="inputs[0].isDisabled"
                class="modal-form__input modal-wrapper-common-width"
              />
              <input-field
                :label="inputs[1].title"
                v-model="inputs[1].value"
                :symbol="inputs[1].symbol"
                :disabled="inputs[1].isDisabled"
                class="modal-form__input modal-wrapper-common-width"
              />
              <input-field
                :label="inputs[2].title"
                v-model="inputs[2].value"
                :symbol="inputs[2].symbol"
                :disabled="inputs[2].isDisabled"
                class="modal-form__input modal-wrapper-common-width"
              />
              <input-field
                :label="inputs[3].title"
                v-model="inputs[3].value"
                :symbol="inputs[3].symbol"
                :disabled="inputs[3].isDisabled"
                class="modal-form__input modal-wrapper-common-width"
              />
              <input-field
                :label="inputs[4].title"
                v-model="inputs[4].value"
                :symbol="inputs[4].symbol"
                :disabled="inputs[4].isDisabled"
                class="modal-form__input modal-wrapper-common-width"
              />
            </div>
            <div class="modal-wrapper-inputs-part">
              <TreeSelect :label="inputs[5].title"
                :normalizer="node=>({...node, label: node.name})"
                v-model="inputs[5].value"
                :clearable="false"
                :options="inputs[5].values"
                class="modal-form__input modal-wrapper-common-width"/>
              <input-field
                :label="inputs[6].title"
                v-model="inputs[6].value"
                :symbol="inputs[6].symbol"
                :disabled="inputs[6].isDisabled"
                class="modal-form__input modal-wrapper-common-width"
              />
              <input-field
                :label="inputs[7].title"
                v-model="inputs[7].value"
                :symbol="inputs[7].symbol"
                :disabled="inputs[7].isDisabled"
                class="modal-form__input modal-wrapper-common-width"
              />
              <div class="modal-form__profit">
                <span class="modal-form__profit-title">Прибыль: </span>
                <span class="modal-form__profit-value">{{ profit }} ₽</span>
              </div>
              <Btn
                class="modal-form__btn modal-wrapper-common-width"
                label="Рассчитать"
                @click="calculate"
              />
            </div>
          </div>
        </form>
        <div class="loader" v-if="!loaded">
          <img src="../../assets/img/loading.svg" alt="">
        </div>
      </div>
    </template>
  </Modal>
</template>   

<script>
  import Btn from "../../shared-components/Btn";
  import InputField from "../../shared-components/InputField"
  import TreeSelect from "@/shared-components/TreeSelect";
  import AsyncImg from "@/shared-components/AsyncImg";
  import {BlackboxService} from "@/services/blackbox_service";
  import {HIDE_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import Modal from "@/components/Modal";
  import {mapMutations} from "vuex";

  export default {
    name: "AddToGroup",
    components: {Modal, Btn, InputField, TreeSelect, AsyncImg},
    props: {
      pk: {
        type: [String, Number],
        required: true
      },
      articul: {
        type: [String, Number],
        required: true
      }
    },
    data: () => ({
      inputs: [
        {
          title: "Розничная цена",
          name: "price",
          isDisabled: false,
          symbol: "₽",
          value: 0,
        },
        {
          title: "Скидка",
          name: "basicSale",
          isDisabled: true,
          symbol: "%",
          value: 0,
        },
        {
          title: "Промокод",
          name: "promoSale",
          isDisabled: true,
          symbol: "%",
          value: 0,
        },
        {
          title: "СПП",
          name: "clientSale",
          isDisabled: true,
          symbol: "%",
          value: 0,
        },
        {
          title: "Процент выкупа",
          name: "percentOfBuying",
          isDisabled: false,
          symbol: "%",
          value: 0,
        },
        {
          title: "Комиссия Wildberries",
          name: "feeForWildberries",
          isDisabled: false,
          symbol: "%",
          value: 5,
          values: [
            {
              name: '5%',
              id: 5,
            },
            {
              name: '10%',
              id: 10,
            },
            {
              name: '12%',
              id: 12,
            },
            {
              name: '15%',
              id: 15,
            },
          ]
        },
        {
          title: "Себестоимость товара",
          name: "productCost",
          isDisabled: true,
          symbol: "₽",
          value: 0,
        },
        {
          title: "Ставка налога",
          name: "fee",
          isDisabled: false,
          symbol: "%",
          value: '',
        },
      ],
      loaded: false,
      isCalculated: false,
      profit: 0,
      product: {
        imagePath: null,
        goodsName: null
      }
    }),
    async created() {
        const blackboxService = new BlackboxService();
        const result = await blackboxService.getCalculatorData(this.pk);
        if(typeof result !== 'object') {
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Произошла ошибка', status: 'error'})
            this.HIDE_MODAL_MUTATION()
            return false;
        }

        await this.loadPath()

        Object.keys(result).forEach(InputName => {
          this.inputs.find(input => input.name === InputName).value = result[InputName]
        })

        this.inputs.find(input => input.name === 'productCost').value = result.price

        this.loaded = true
    },
    methods: {
        async loadPath() {
          const service = new BlackboxService();
          const data = await service.getProductImagePathAndName(this.articul);
          if (typeof data === 'object') {
            this.product.imagePath = data.imageLink;
            this.product.goodsName = data.name;
          }
        },
        calculate() {
          // Розничная цена
          const price = this.inputs.find(item => item.name === 'price').value;
          // Согласованная скидка
          const basicSale = this.inputs.find(item => item.name === 'basicSale').value;
          // Согласованный промокод
          const promoSale = this.inputs.find(item => item.name === 'promoSale').value;
          // Согласованная СПП
          const clientSale = this.inputs.find(item => item.name === 'clientSale').value;
          // Ставка налога
          const fee = this.inputs.find(item => item.name === 'fee').value;
          // Процент выкупа 
          let percentOfBuying = this.inputs.find(item => item.name === 'percentOfBuying').value;
          if(!percentOfBuying) {
            percentOfBuying = 1
          }
          // Процент вознаграждения Wildberries 
          const feeForWildberries = this.inputs.find(item => item.name === 'feeForWildberries').value;
          // Себестоимость товара 
          const productCost = this.inputs.find(item => item.name === 'productCost').value;


          // Сумма всех скидок
          const allSales = price - price * (1- basicSale / 100) * (1- promoSale / 100) * (1- clientSale / 100);

          // Покупатель приобрел товар за
          const bougthPrice = price - allSales;

          // Вознаграждение Wildberries
          const award = bougthPrice * feeForWildberries / 100;

          // Среднестатистическая стоимость доставки
          const transport = 66 * (100 / percentOfBuying - 1) + 33;

          // Начисление с продажи одной единицы
          const forOneSale = bougthPrice - award - transport;

          // Валовая прибыль до вычета налогов (EBITDA):
          const profitBeforeFees = forOneSale - productCost;

          // Сумма налога
          const feeSum = bougthPrice * fee / 100;

          // Вы заработали 
          const profit = profitBeforeFees - feeSum;
          
          this.profit = profit.toFixed(1);
          this.isCalculated = true;
        },
        ...mapMutations('modal', [HIDE_MODAL_MUTATION]),
    }
  }
</script>

<style lang="scss" scoped>
  .modal {
    &-wrapper {
      max-height: calc(100% - (5.57rem * 2));
      margin-top: 10px;
      &-inputs {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
        &-part {
          max-width: calc(100% / 2 - 1rem);
          width: 100%;
        }
      }
      &_product {
        display: flex;
        align-items: flex-start;
        width: 100%;
        margin: 0px 0px 20px 0px;
        &-photo {
          width: 88px;
          height: 88px;
          -o-object-fit: cover;
          object-fit: cover;
          min-width: 88px;
        }
        &-title {
          margin-left: 20px;
          font-size: 1.4rem;
          font-weight: 500;
        }
      }
      &-common-width {
        width: 100%;
      }
    }
    &-form {
      overflow: visible;
      display: flex !important;
      flex-direction: row !important;
      justify-content: space-between;
      flex-wrap: wrap;
      &__profit {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid #DFE0EB;
        margin-top: 33px;
        height: calc(2.85rem + 3px + 20px);
        padding-top: 11px;
        &-title {
          font-weight: bold;
          padding: 0px 5px;
        }
        &-value {
          font-weight: bold;
          padding: 0px 5px;
        }
      }
      &__btn {
        margin: 10px auto 0px auto;
      }
      &__input {
        margin: 10px 0px 0px 0px;
      }
      &__range {
        margin-top: 10px;
        &-header {
          color: #000;
          padding: 0px 0px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &__title {
              letter-spacing: .2px;
              color: #9FA2B4;
              font-weight: bold;
              display: block;
          }
          &__value {
              letter-spacing: .2px;
              display: block;
          }
        }
      }
    }
    & .loader {
      & img {
        margin: 0px auto;
      }
    }
  }
</style>