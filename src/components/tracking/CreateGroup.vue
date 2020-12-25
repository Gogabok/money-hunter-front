<template>
  <Modal title="Создать группу" closable @next="onNext">
    <template v-slot:default>
      <!-- <div class="modal-tabs">
        <div class="modal-tabs__item" v-for="(item, idx) in addTypes" :class="{active: selectedType===item}"
             :key="idx"
             @click="selectedType=item"
             style="display: block; cursor:pointer;">
          <strong v-if="selectedType===item">
            <span v-html="translatedType(item)"/>
          </strong>
          <span v-else v-html="translatedType(item)"/>
        </div>
      </div> -->

      <div class="modal-form-steps">
        <div class="modal-form-steps__line"/>
        <div class="modal-form-steps__item"
             :class="{'modal-form-steps__item_success': firstDone, 'modal-form-steps__item_active': !firstDone}">
          <div class="step-circle">1</div>
          <div class="step-name">Название группы</div>
        </div>
        <div class="modal-form-steps__item" :class="{'modal-form-steps__item_active': firstDone}">
          <div class="step-circle">2</div>
          <div class="step-name">{{secondStepName}}</div>
        </div>
      </div>

      <form class="modal-form">
        <template v-if="!firstDone">
          <ValidationProvider :rules="{required: true}" v-slot="{errors}" ref="firstStepProvider">
            <div class="modal-form__save-project">
              <InputField label="Придумайте название для вашей группы"
                          v-model="groupName"
                          :error="$getValidationError(errors)"/>
            </div>

            <div class="modal-form__submit-item">
              <Btn label="Далее" type="button" @click="firstStepDoneHandler"/>
            </div>
          </ValidationProvider>
        </template>
        <template v-if="firstDone">
          <ValidationObserver ref="secondStepObserver">
            <ValidationProvider
              v-if="selectedType==='byGoods'"
              :rules="{required: true, is_type: 'object'}"
              :custom-messages="{is_type: 'Не найдено'}"
              v-slot="{errors}"
              key="byGoodsType">
              <FindProductModal @selectedProducts="selectedProducts" v-model="foundedProduct" :validation-error="$getValidationError(errors)"/>
            </ValidationProvider>

            <!-- <ValidationProvider v-else :rules="{required: true}" v-slot="{errors}" key="byBrandType">
              <BrandsSelector
                :errors="errors"
                v-model="selectedBrands"
              />

            </ValidationProvider> -->

            <div class="modal-form__double-submit modal-form__double-submit_save-project">
              <div class="modal-form__double-submit-item">
                <Btn label="Назад" clazz="button_gray" @click="firstDone=false"/>
              </div>
              <div class="modal-form__double-submit-item">
                <Btn :loading="loading" label="Сохранить" @click="createGroupBtnHandler"/>
              </div>
            </div>
          </ValidationObserver>
        </template>

      </form>

    </template>
  </Modal>
</template>

<script>
  import Btn from "../../shared-components/Btn";
  import InputField from "../../shared-components/InputField";
  import Modal from "@/components/Modal";
  import FindProductModal from "@/shared-components/FindProductModal";
  import {ValidationProvider, ValidationObserver} from 'vee-validate';
  import {TrackingService} from "@/services/tracking_service";
  import {LOAD_GROUPS_ACTION} from "@/store/modules/tracking/constants";
  import {SET_MODAL_RESPONSE_MUTATION, SHOW_MODAL_MUTATION, HIDE_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import {mapMutations} from "vuex";
  // import BrandsSelector from "@/shared-components/BrandsSelector";

  const ADD_BY_GOODS = 'byGoods';
  const ADD_BY_BRAND = 'byBrand';

  export default {
    name: "CreateGroup",
    components: {FindProductModal, InputField, Btn, Modal, ValidationProvider, ValidationObserver},
    data() {
      return {
        firstDone: false,
        groupName: '',
        foundedProduct: null,
        selectedBrands: [],

        addTypes: [ADD_BY_GOODS, ADD_BY_BRAND],
        selectedType: ADD_BY_GOODS,

        products: null,

        loading: false
      }
    },
    computed: {
      secondStepName() {
        return this.selectedType === ADD_BY_GOODS
          ? 'Добавить товар'
          : 'Добавить бренд';
      },
    },
    methods: {
      translatedType(type) {
        return type === ADD_BY_GOODS ? 'По одному' : 'Бренд';
      },
      onNext() {
        if (this.firstDone) {
          this.createGroupBtnHandler();
        } else {
          this.firstStepDoneHandler();
        }
      },
      async firstStepDoneHandler() {
        this.firstDone = await this.$validationProviderIsValid(this.$refs.firstStepProvider);
      },
      async createGroupBtnHandler() {
        this.loading = true

        if (await this.$refs.secondStepObserver.validate) {
          const service = new TrackingService();
          const result = await service.createUpdateGroup(
            this.groupName,
            // this.selectedType === ADD_BY_GOODS ? [this.foundedProduct.articul] : this.selectedBrands,
            this.selectedType === ADD_BY_GOODS ? this.products : this.selectedBrands,
            this.selectedType === ADD_BY_BRAND
          );

          if (result) {
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Группа создана', status: 'success'})
            // this[SHOW_MODAL_MUTATION]({component: Warning, data: {title: 'Группа создана'}});
            await this.$store.dispatch(`tracking/${LOAD_GROUPS_ACTION}`);
            await this.$store.commit(`modal/${HIDE_MODAL_MUTATION}`);
            await this.$router.push({name: 'tracking.group', params: {name: this.groupName.toUpperCase()}});
          } else {
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Произошла ошибка', status: 'error'})
            // this[SHOW_MODAL_MUTATION]({component: Warning, data: {title: 'Произошла ошибка'}});
          }
        }

        this.loading = false
      },

      selectedProducts(products) {
        this.products = products
      },

      ...mapMutations('modal', [SET_MODAL_RESPONSE_MUTATION]),
      ...mapMutations('modal', [SHOW_MODAL_MUTATION]),
      ...mapMutations('modal', [HIDE_MODAL_MUTATION])
    }
  }
</script>

<style scoped>

</style>