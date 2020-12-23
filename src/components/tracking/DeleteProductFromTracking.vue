<template>
  <Modal title='Удаление отслеживаемого товара' closable @next="deleteHandler">
    <template v-slot:default>

      <form action="" class="modal-form" @submit.prevent>
        <div class="modal-form-search">
          <div class="modal-form-search__not"><span>Уверены, что хотите перестать отслеживать?</span>
          </div>
        </div>

        <div class="modal-form__double-submit modal-form__double-submit_save-project">
          <div class="modal-form__double-submit-item">
            <Btn label="Отмена" clazz="button_gray" @click="cancelHandler"/>
          </div>
          <div class="modal-form__double-submit-item">
            <Btn label="Перестать" @click="deleteHandler"/>
          </div>
        </div>
      </form>

    </template>
  </Modal>
</template>

<script>
  import Modal from "../Modal";
  import Btn from "../../shared-components/Btn";
  import {TrackingService} from "../../services/tracking_service";
  import {HIDE_MODAL_MUTATION} from "../../store/modules/modal/constants";
  import {LOAD_GROUPS_ACTION} from "@/store/modules/tracking/constants";

  export default {
    name: "DeleteProductFromTracking",
    components: {Btn, Modal},
    props: {
      groupName: {
        type: String,
        required: true,
      },
      articul: {
        type: Array,
        required: true,
      },
      callback: {
        type: Function,
        required: false,
      }
    },
    methods: {
      async deleteHandler() {

        const service = new TrackingService();
        let result = false
        await Promise.all(this.articul.map(async (articul) => {
          result = await service.deleteProductFromTracking(this.groupName, articul);
        }));
        if (typeof result === 'boolean' && result) {
          this.callback();
          if(this.articul.length === 1) {
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: `Товар ${this.articul[0]} удален`, status: 'success'})
          } else {
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: `Товары удалены`, status: 'success'})
          }
          await this.$store.dispatch(`tracking/${LOAD_GROUPS_ACTION}`);
          this.$store.commit(`modal/${HIDE_MODAL_MUTATION}`);
        } else {
          if(this.articul.length === 1) {
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: `Товар ${this.articul[0]} не был удален`, status: 'error'})
          } else {
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: `Товары не были удалены`, status: 'error'})
          }
        }
      },
      async cancelHandler() {
        this.$store.commit(`modal/${HIDE_MODAL_MUTATION}`);
      }
    }
  }
</script>

<style scoped>

</style>