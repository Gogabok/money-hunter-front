<template>
  <Fragment>
    <div class="modal-form__save-project">
      <div class="modal-form__save-project-wrapper">
        <FindProductInputField label="Введите артикул товара или ссылку на него"
                  v-model="selectedArticul"
                  :products="products"
                  @input="handleProductSearch"
                  @removeProduct="removeProduct"
                  :error="validationError"/>
      </div>
    </div>
    <template v-if="value!==null && lastProduct">
      <div class="modal-form-search" v-if="typeof value==='string'">
        <!-- <div class="modal-form-search__not"><span>{{value}}</span></div> -->
      </div>
      <div class="modal-form-product" v-if="typeof value==='object'">
        <div v-if="this.products.length > 0 || selectedArticul" class="product-item">
          <div class="product-photo"><img :src="lastProduct.imageLink" alt=""></div>
          <div class="product-info">
            <div class="product name">{{lastProduct.name}} - {{lastProduct.brand}}</div>
            <div class="product-code">{{selectedArticul || products.length > 0 ? products[products.length - 1] : ''}}</div>
          </div>
        </div>
      </div>
    </template>
  </Fragment>
</template>

<script>
  import {Fragment} from 'vue-fragment';
  import FindProductInputField from "./FindProductInputField";
  import {debounce} from "lodash";
  import {TrackingService} from "../services/tracking_service";

  export default {
    name: "FindProductModal",
    components: {FindProductInputField, Fragment},
    props: {
      value: {
        type: [Object, String],
        required: false,
      },
      validationError: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        selectedArticul: '',
        inputedArticul: '',
        debouncedProductSearch: debounce(this.searchProduct, 500),
        products: [],
        lastProduct: false
      }
    },
    watch: {
      products: async function() {
        if(this.products.length > 0) {
          const service = new TrackingService();
          const result = await service.getProductInfoByArticul(this.products[this.products.length - 1])
          this.lastProduct = {...result}
        } else {
          this.lastProduct = false
        }
        this.$emit('selectedProducts', this.products);
      }
    },
    methods: {
      handleProductSearch() {
        const a = document.createElement('a');
        a.href = this.selectedArticul;

        const regex = /\d+/g;
        const matches = a.pathname.match(regex); 

        this.inputedArticul = matches[0]

        this.debouncedProductSearch();
      },
      async searchProduct() {
        const service = new TrackingService();
        const result = await service.getProductInfoByArticul(this.inputedArticul);

        if(typeof result === 'object' && !this.products.find(i => i === this.inputedArticul)) {
          this.products.push(this.inputedArticul)
          this.selectedArticul = ''
        }

        this.$emit('input', typeof result === 'object' ? {...result, articul: this.inputedArticul} : result);
      },
      removeProduct(i) {
        this.products.splice(this.products.findIndex(item => item === i), 1)
      },
    }
  }
</script>

<style lang="scss">
  .product-photo img {
    width: 44px;
    height: 44px;
    object-fit: cover;
  }
  .modal-form__save-project-wrapper {
    position: relative;
  }
  .modal-form__save-project-wrapper-value-item {
    position: relative;
  }
</style>