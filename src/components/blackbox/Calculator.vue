<template>
  <Modal class="modal" title="Калькулятор" closable>
    <template v-slot:default>
      <div class="modal-wrapper">
        <form v-if="loaded" action="" class="modal-form">
          <div class="modal-form__range-header">
            <span class="modal-form__range-header__title">{{ rangeData2.title }}</span>
            <span class="modal-form__range-header__value">{{ rangeDataValue2 }}{{ rangeData2.currency }}</span>
          </div>
          <vue-range-slider
              v-model="rangeDataValue2"
              :tooltip="'hover'"
              :process-style="{background: `#FFC700`}"
              :tooltip-dir="'bottom'"
              :tooltip-style="{background: `#FFC700`, borderColor: `#FFC700`}"
              :min="0"
              :max="100"
              @input="isCalculated ? calculate() : false"
            />
          <input-field
            v-for="input in inputs"
            :key="input.name"
            :label="input.title"
            v-model="input.value"
            :symbol="input.symbol"
            :disabled="input.isDisabled"
            class="modal-form__input"
            @input="isCalculated ? calculate() : false"
          />
          <div class="modal-form__range">
            <div class="modal-form__range-header">
              <span class="modal-form__range-header__title">{{ rangeData1.title }}</span>
              <span class="modal-form__range-header__value">{{ rangeDataValue1 }}{{ rangeData1.currency }}</span>
            </div>
            <vue-range-slider
              v-model="rangeDataValue1"
              :tooltip="'hover'"
              :process-style="{background: `#FFC700`}"
              :tooltip-dir="'bottom'"
              :tooltip-style="{background: `#FFC700`, borderColor: `#FFC700`}"
              :min="0"
              :max="100"
              @input="isCalculated ? calculate() : false"
            />
          </div>
          <Btn
            class="modal-form__btn"
            label="Рассчитать"
            @click="calculate"
            v-if="!isCalculated"
          />
        </form>
        <form v-if="loaded && isCalculated" action="" class="modal-form">
          <input-field
            v-for="input in resultInputs"
            :key="input.name"
            :label="input.title"
            v-model="input.value"
            :symbol="input.symbol"
            :disabled="input.isDisabled"
            class="modal-form__input"
          />
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
  import {BlackboxService} from "@/services/blackbox_service";
  import {HIDE_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import Modal from "@/components/Modal";
  import 'vue-range-component/dist/vue-range-slider.css'
  import VueRangeSlider from 'vue-range-component'
//   import {SHOW_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import {mapMutations} from "vuex";

  export default {
    name: "AddToGroup",
    components: {Modal, Btn, InputField, VueRangeSlider},
    props: {
      pk: {
        type: [String, Number],
        required: true
      }
    },
    data: () => ({
      rangeDataValue1: 1,
      rangeData1: {
        title: "Процент выкупа",
        currency: "%",
      },
      rangeDataValue2: 1,
      rangeData2: {
        title: "Процент вознаграждения Wildberries",
        currency: "%",
      },
      inputs: [
        {
          title: "Розничная цена",
          name: "price",
          isDisabled: true,
          symbol: "₽",
          value: 0,
        },
        {
          title: "Согласованная скидка",
          name: "basicSale",
          isDisabled: true,
          symbol: "%",
          value: 0,
        },
        {
          title: "Согласованный промокод",
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
          title: "Себестоимость товара",
          name: "productCost",
          isDisabled: false,
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
      resultInputs: [
        {
          title: "Покупатель приобрел товар за",
          name: "result-bougthPrice",
          isDisabled: true,
          symbol: "₽",
          value: '',
        },
        {
          title: "Сумма всех скидок",
          name: "result-allSales",
          isDisabled: true,
          symbol: "₽",
          value: '',
        },
        {
          title: "Вознаграждение Wildberries",
          name: "result-award",
          isDisabled: true,
          symbol: "₽",
          value: '',
        },
        {
          title: "Среднестатистическая стоимость доставки",
          name: "result-transport",
          isDisabled: true,
          symbol: "₽",
          value: '',
        },
        {
          title: "Сумма налога",
          name: "result-feeSum",
          isDisabled: true,
          symbol: "₽",
          value: '',
        },
      ]
    }),
    async created() {
        const blackboxService = new BlackboxService();
        const result = await blackboxService.getCalculatorData(this.pk);
        if(typeof result !== 'object') {
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Произошла ошибка', status: 'error'})
            this.HIDE_MODAL_MUTATION()
            return false;
        }

        Object.keys(result).forEach(InputName => {
          this.inputs.find(input => input.name === InputName).value = result[InputName]
        })

        this.inputs.find(input => input.name === 'productCost').value = result.price

        this.loaded = true
    },
    methods: {
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


          // Сумма всех скидок
          const allSales = price - price * (1- basicSale / 100) * (1- promoSale / 100) * (1- clientSale / 100);

          // Покупатель приобрел товар за
          const bougthPrice = price - allSales;

          // Вознаграждение Wildberries
          const award = bougthPrice * this.rangeDataValue2 / 100;

          // Среднестатистическая стоимость доставки
          const transport = 66 * (100 / this.rangeDataValue1 - 1) + 33

          // Сумма налога
          const feeSum = bougthPrice * fee / 100;

          this.resultInputs.find(input => input.name === 'result-allSales').value = allSales.toFixed(2);
          this.resultInputs.find(input => input.name === 'result-bougthPrice').value = bougthPrice.toFixed(2);
          this.resultInputs.find(input => input.name === 'result-award').value = award.toFixed(2);
          this.resultInputs.find(input => input.name === 'result-transport').value = transport.toFixed(2);
          this.resultInputs.find(input => input.name === 'result-feeSum').value = feeSum.toFixed(2);

          this.isCalculated = true
        },
        ...mapMutations('modal', [HIDE_MODAL_MUTATION]),
    }
  }
</script>

<style lang="scss" scoped>
  .modal {
    &-wrapper {
      max-height: calc(100% - (5.57rem * 2));
      overflow-y: scroll;
      margin-top: 10px;
    }
    &-form {
      overflow: visible;
      &__btn {
        max-width: 250px;
        margin: 20px auto 0px auto;
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