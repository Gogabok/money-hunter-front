<template>
  <Modal title="Сохранить фильтр" @next="saveHandler">
    <template v-slot:default>
      <ValidationProvider v-slot="{errors}" :rules="{required: true}" ref="validation">
        <form action="" class="modal-form" @submit.prevent>
          <div class="modal-form__save-project">
            <InputField
              label="Используйте ясное и уникальное имя, чтобы вы могли легко идентифицировать проект."
              placeholder="Название проекта"
              v-model="name"
              :error="nameError || $getValidationError(errors)"
            />
          </div>
          <div class="modal-form__double-submit modal-form__double-submit_save-project">
            <div class="modal-form__double-submit-item">
              <Btn label="Отмена" clazz="button_gray" @click="hideModal"/>
            </div>
            <div class="modal-form__double-submit-item">
              <Btn :loading="loading" label="Сохранить" @click="saveHandler"/>
            </div>
          </div>
        </form>
      </ValidationProvider>
    </template>
  </Modal>
</template>

<script>
  import Modal from "../Modal";
  import Warning from "@/components/blackbox/Warning";
  import InputField from "../../shared-components/InputField";
  import Btn from "../../shared-components/Btn";
  import {HIDE_MODAL_MUTATION, SHOW_MODAL_MUTATION, SET_MODAL_RESPONSE_MUTATION} from "@/store/modules/modal/constants";
  import {mapMutations, mapState} from "vuex";
  import {BlackboxService} from "@/services/blackbox_service";
  import {ValidationProvider} from 'vee-validate';

  export default {
    name: "SaveProject",
    components: {Btn, Modal, InputField, ValidationProvider},
    data() {
      return {
        name: '',
        nameError: null,

        loading: false
      }
    },
    computed: {
      ...mapState('modal', ['nested'])
    },
    methods: {
      async saveHandler() {
        this.loading = true

        if (await this.$validationProviderIsValid(this.$refs.validation)) {
          const blackboxService = new BlackboxService();
          const _nested = {...this.nested};

          const result = await blackboxService.saveSearch(this.name, _nested);
          if (typeof result === 'boolean' && result) {
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Проект сохранен', status: 'success'})
            await this.$store.commit(`modal/${HIDE_MODAL_MUTATION}`);
          } else {
            this.nameError = result;
          }
        }

        this.loading = false
      },
      ...mapMutations('modal', [HIDE_MODAL_MUTATION]),
      ...mapMutations('modal', [SET_MODAL_RESPONSE_MUTATION]),
      ...mapMutations('modal', [SHOW_MODAL_MUTATION])
    }
  }
</script>

<style scoped>

</style>