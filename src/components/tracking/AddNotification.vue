<template>
  <Modal title="Добавить оповещение" closable>
    <template v-slot:default>
      <form action="" class="modal-form" @submit.prevent>


        <div class="modal-form__input-item">
          <InputField label="Уведомлять при изменении цены" v-model="local_price_change"></InputField>
        </div>


        <div class="modal-form__input-item">
          <InputField label="Уведомлять при снижении остатка меньше заданного" v-model="local_min_quantity"></InputField>
        </div>

        <div class="modal-form__input-item">
          <label class="" for="new_feedback">
            <input v-model="local_new_feedback" id="new_feedback" type="checkbox">
            Уведомлять при новых отзывах
          </label>
        </div>

        <div class="modal-form__input-item">
          <label class="" for="stocks_gain">
            <input v-model="local_stocks_gain" id="stocks_gain" type="checkbox">
            Уведомлять при новых остатках
          </label>
        </div>
      </form>
    </template>
  </Modal>
</template>

<script>
import Modal from "../Modal.vue";
import InputField from "@/shared-components/InputField";
import {TrackingService} from '../../services/tracking_service';

export default {
  name: "AddNotification",
  props: {
    notification_id: {
      type: Number,
      required: true,
    },
    new_feedback: {
      type: Boolean,
      required: true,
    },
    min_quantity: {
      type: Number,
      required: true,
    },
    price_change: {
      type: Number,
      required: true,
    },
    stocks_gain: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {

    }
  },
  computed: {
    local_price_change: {
      get: function () { return this.price_change; },
      set: function (v) {
        const service = new TrackingService();
        service.putGroupNotification(this.notification_id, {price_change: v});
      }
    },
    local_stocks_gain: {
      get: function () { return this.stocks_gain; },
      set: function (v) {
        const service = new TrackingService();
        service.putGroupNotification(this.notification_id, {stocks_gain: v});
      }
    },
    local_min_quantity: {
      get: function () { return this.min_quantity; },
      set: function (v) {
        const service = new TrackingService();
        service.putGroupNotification(this.notification_id, {min_quantity: v});
      }
    },
    local_new_feedback: {
      get: function () { return this.new_feedback; },
      set: function (v) {
        const service = new TrackingService();
        service.putGroupNotification(this.notification_id, {new_feedback: v});
      }
    },
  },
  components: {
    InputField,
    Modal
  }
}
</script>

<style scoped>

</style>