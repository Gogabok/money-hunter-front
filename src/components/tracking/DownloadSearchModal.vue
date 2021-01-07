<template>
  <Modal title="Скачать товары из группы" closable>
    <template v-slot:default>
        <div class="modal-form">
            <Btn
                class="modal-form-save"
                label="По размерам"
                @click="downloadBySize"
            />
            <Btn
                class="modal-form-save"
                label="По артикулам"
                @click="downloadByArticul"
            />
        </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "../Modal.vue";
import {HIDE_MODAL_MUTATION} from "@/store/modules/modal/constants";
import {TrackingService} from "@/services/tracking_service";
import Btn from "@/shared-components/Btn"
import {mapMutations} from "vuex";

export default {
  name: "AddNotification",
  components: {
    Modal,
    Btn,
  },
  props: {
      groupName: {
          type: String,
          required: true
      }
  },
  methods: {
        async downloadBySize() {
            const service = new TrackingService();
            const result = await service.getGroupInfoBySizeFile(this.$route.params.name);
            let isError = 'error'
            if(result === 'Файл успешно скачен') {
                isError = 'success'
            }
            this[HIDE_MODAL_MUTATION]()
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: result, status: isError})
        },
        async downloadByArticul() {
            const service = new TrackingService();
            const result = await service.getGroupInfoByArticulFile(this.$route.params.name);
            let isError = 'error'
            if(result === 'Файл успешно скачен') {
                isError = 'success'
            }
            this[HIDE_MODAL_MUTATION]()
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: result, status: isError})
        },
        ...mapMutations('modal', [HIDE_MODAL_MUTATION]),
  }
}
</script>

<style lang="scss" scoped>
  .modal-form {
      margin-top: 40px;
    &-save {
      max-width: 150px;
      margin: 5px auto;
    }
  }
</style>