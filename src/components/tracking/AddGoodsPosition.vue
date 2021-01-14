<template>
  <Modal title="Добавить товар" closable @next="onNext">
    <template v-slot:default>

      <div class="modal-form-steps" v-if="!isGroupRoute">
        <div class="modal-form-steps__line"/>
        <div class="modal-form-steps__item"
             :class="{'modal-form-steps__item_success': firstDone, 'modal-form-steps__item_active': !firstDone}">
          <div class="step-circle">1</div>
          <div class="step-name" v-text="firstStepName"/>
        </div>
        <div class="modal-form-steps__item" :class="{'modal-form-steps__item_active': firstDone}">
          <div class="step-circle">2</div>
          <div class="step-name">Выберите группу</div>
        </div>
      </div>

      <form ref="form" action="" class="modal-form" @submit.prevent>
        <template v-if="!firstDone">
          <ValidationObserver ref="firstStepObserver">
            <ValidationProvider
              v-if="selectedType==='byGoods'"
              :rules="{required: true, is_type: 'object'}"
              :custom-messages="{is_type: 'Не найдено'}"
              v-slot="{errors}"
              key="byGoodsType">
              <FindProductModal @selectedProducts="selectedProducts" v-model="foundedProduct" :validation-error="$getValidationError(errors)"/>
            </ValidationProvider>

            <div class="modal-form__submit-item">
              <Btn :label="isGroupRoute ? 'Добавить' : 'Далее'"
                   :loading="isGroupRoute ? loading : false"
                   type="button"
                   @click="firstStepDoneHandler"/>
            </div>
          </ValidationObserver>
        </template>

        <template v-if="firstDone">
          <ValidationProvider v-slot="{errors}" :rules="{required: true}" ref="secondStepProvider">
            <SelectGroupModal v-model="selectedGroup" :error="$getValidationError(errors)"/>

            <div class="modal-form__double-submit modal-form__double-submit_save-project">
              <div class="modal-form__double-submit-item">
                <Btn label="Назад" clazz="button_gray" @click="firstDone=false"/>
              </div>
              <div class="modal-form__double-submit-item">
                <Btn :loading="loading" label="Сохранить" @click="handleSaveBtn"/>
              </div>
            </div>
          </ValidationProvider>
        </template>
      </form>

    </template>
  </Modal>
</template>

<script>
  import Modal from "@/components/Modal";
  import Btn from "@/shared-components/Btn";
  import {TrackingService} from "@/services/tracking_service";
  import {SET_MODAL_RESPONSE_MUTATION, SHOW_MODAL_MUTATION, HIDE_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import {LOAD_GROUPS_ACTION} from "@/store/modules/tracking/constants";
  import {mapMutations} from "vuex";
  import {ValidationProvider, ValidationObserver} from 'vee-validate';
  import SelectGroupModal from "@/shared-components/SelectGroupModal";
  import FindProductModal from "@/shared-components/FindProductModal";

  const ADD_BY_GOODS = 'byGoods';
  const ADD_BY_BRAND = 'byBrand';

  export default {
    name: "AddGoodsPosition",
    components: {
      FindProductModal, SelectGroupModal, Modal, Btn, ValidationProvider, ValidationObserver
    },
    data() {
      return {
        firstDone: false,
        addTypes: [ADD_BY_GOODS, ADD_BY_BRAND],
        selectedType: ADD_BY_GOODS,

        foundedProduct: null,

        selectedBrands: [],
        selectedGroup: '',

        products: null,

        loading: false
      }
    },
    computed: {
      firstStepName() {
        return this.selectedType === ADD_BY_GOODS
          ? 'Добавить товар'
          : 'Добавить бренд';
      },
      isGroupRoute() {
        return this.$route.name === 'tracking.group'
      }
    },
    mounted() {
      this.$refs.form.addEventListener("submit", (event) => {
          event.preventDefault()
      });
    },
    methods: {
      translatedType(type) {
        return type === ADD_BY_GOODS ? 'По одному' : 'Бренд';
      },
      onNext() {
        if (this.firstDone) {
          this.handleSaveBtn();
        } else {
          this.firstStepDoneHandler();
        }
      },
      async firstStepDoneHandler() {
        if(!this.isGroupRoute) {
          this.firstDone = await this.$refs.firstStepObserver.validate();
        } else {
          this.selectedGroup = this.$route.params.name
          this.handleSaveBtn()
        }
      },
      async handleSaveBtn() {
        this.loading = true

        if (!this.isGroupRoute && !this.$validationProviderIsValid(this.$refs.secondStepProvider)) {
          return;
        }

        const service = new TrackingService();
        const result = await service.createUpdateGroup(
          this.selectedGroup,
          this.selectedType === ADD_BY_GOODS ? this.products : this.selectedBrands,
          this.selectedType === ADD_BY_BRAND
        );

        if (result) {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Товары добавлены', status: 'success'})
          await this.$store.dispatch(`tracking/${LOAD_GROUPS_ACTION}`);
          await this.$store.commit(`modal/${HIDE_MODAL_MUTATION}`);
          if (this.$route.fullPath !== this.$router.resolve({
            name: 'tracking.group',
            params: {name: this.selectedGroup.toUpperCase()}
          }).route.fullPath) {
            await this.$router.push({name: 'tracking.group', params: {name: this.selectedGroup.toUpperCase()}});
          } else {
            this.$eventBus.$emit('tracking.group.loadGoods');
          }
        } else {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Произошла ошибка', status: 'error'})
          await this.$store.commit(`modal/${HIDE_MODAL_MUTATION}`);
        }

        this.loading = false
      },

      selectedProducts (products) {
        this.products = products
      },

      ...mapMutations('modal', [SET_MODAL_RESPONSE_MUTATION]),
      ...mapMutations('modal', [SHOW_MODAL_MUTATION]),
      ...mapMutations('modal', [HIDE_MODAL_MUTATION])
    },
  }
</script>

<style scoped lang="scss">
  @import "../../assets/scss/variables.scss";

  .input-field__label {
    letter-spacing: .2px;
    color: $titleColor;
    font-weight: bold;
    display: block;
  }
</style>