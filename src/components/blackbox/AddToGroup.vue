<template>
  <Modal title="Выберите группу" closable @next="addBtnHandler">
    <template v-slot:default>
      <form action="" class="modal-form">
        <ValidationProvider v-slot="{errors}" :rules="{required: true}" ref="validation">
          <SelectGroupModal v-model="selectedGroup" :error="$getValidationError(errors)"/>

          <div class="modal-form__submit-item">
            <Btn :loading="loading" label="Добавить" type="button" @click="addBtnHandler"/>
          </div>
        </ValidationProvider>
      </form>
    </template>
  </Modal>
</template>

<script>
  import SelectGroupModal from "../../shared-components/SelectGroupModal";
  import {ValidationProvider} from 'vee-validate';
  import Btn from "../../shared-components/Btn";
  import {TrackingService} from "@/services/tracking_service";
  import {LOAD_GROUPS_ACTION} from "@/store/modules/tracking/constants";
  import {HIDE_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import Modal from "@/components/Modal";

  import Warning from "@/components/blackbox/Warning";
  import {SHOW_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import {mapMutations} from "vuex";

  export default {
    name: "AddToGroup",
    components: {Modal, Btn, SelectGroupModal, ValidationProvider},
    props: {
      articul: {
        type: [String, Array],
        required: true
      }
    },
    data() {
      return {
        selectedGroup: '',

        loading: false
      }
    },
    methods: {
      async addBtnHandler() {
        this.loading = true

        if (!this.$validationProviderIsValid(this.$refs.validation)) {
          return;
        }

        const service = new TrackingService();
        const result = await service.createUpdateGroup(
          this.selectedGroup,
          typeof this.articul === 'string' ? [this.articul] : [...this.articul],
          false
        );

        if (result) {
          // this[SHOW_MODAL_MUTATION]({component: Warning, data: {title: 'Товар добавлен'}});
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Товар добавлен', status: 'success'})
          await this.$store.dispatch(`tracking/${LOAD_GROUPS_ACTION}`);
          await this.$store.commit(`modal/${HIDE_MODAL_MUTATION}`);
        } else {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Достигнут максимум отслеживаемых товаров, обновите подписку', status: 'error'})
          await this.$store.commit(`modal/${HIDE_MODAL_MUTATION}`);
          // this[SHOW_MODAL_MUTATION]({component: Warning, data: {title: 'Достигнут максимум отслеживаемых товаров, обновите подписку'}});
        }

        this.loading = false
      },
      ...mapMutations('modal', [SHOW_MODAL_MUTATION])
    }
  }
</script>

<style scoped>

</style>