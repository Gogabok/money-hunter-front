<template>
  <Modal title="Добавить оповещение" closable>
    <template v-slot:default>
      <form action="" class="modal-form" @submit.prevent>
        <notification-range
            v-for="range in ranges"
            :key="range.title"
            :rangeData="range"
            @changeValue="changeValue"
        />

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

        <Btn
            class="modal-form-save"
            label="Сохранить"
            @click="saveNotifications"
        />
      </form>
    </template>
  </Modal>
</template>

<script>
import Modal from "../Modal.vue";
import {TrackingService} from '../../services/tracking_service';
import NotificationRange from "@/components/notifications/NotificationRange.vue"
import {HIDE_MODAL_MUTATION} from "@/store/modules/modal/constants";
import Btn from "@/shared-components/Btn"

export default {
  name: "AddNotification",
  components: {
    Modal,
    Btn,
    NotificationRange
  },
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
      ranges: [
        {
            title: "Остаток",
            range: [1, 1000],
            desc: "Оповещение, когда остаток достигнет:",
            value: 1,
            currency: "шт.",
            isActive: true
        },
        {
            title: "Цена",
            range: [1, 10000],
            desc: "Оповещения, когда цена товара изменится на",
            value: 1,
            currency: "₽",
            isActive: true
        },
      ],
      local_stocks_gain: this.stocks_gain,
      local_new_feedback: this.new_feedback,
    }
  },
  methods: {
    async saveNotifications() {
        const service = new TrackingService();
        const notificationsData = {
          new_feedback: this.local_new_feedback,
          stocks_gain: this.local_stocks_gain
        }

        notificationsData["min_quantity"] = this.ranges.find(range => range.title === 'Остаток').isActive 
          ? this.ranges.find(range => range.title === 'Остаток').value
          : 0;

        notificationsData["price_change"] = this.ranges.find(range => range.title === 'Цена').isActive 
          ? this.ranges.find(range => range.title === 'Цена').value
          : 0;

        const result = await service.putGroupNotification(this.notification_id, {...notificationsData});

        if(result.status === 200) {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Оповещения сохранены', status: 'success'})
          await this.$store.commit(`modal/${HIDE_MODAL_MUTATION}`);
        } else {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Произошла ошибка', status: 'error'})
          await this.$store.commit(`modal/${HIDE_MODAL_MUTATION}`);
        }

    },
    changeValue(range) {
        if(range.value !== false) {
            this.ranges.find(item => item.title === range.title).value = range.value
            this.ranges.find(item => item.title === range.title).isActive = true
        } else {
            this.ranges.find(item => item.title === range.title).isActive = false
        }
    }
  },
  created() {
    if(this.min_quantity > 0) {
      this.ranges.find(range => range.title === 'Остаток').value = this.min_quantity;
    } else {
      this.ranges.find(range => range.title === 'Остаток').isActive = false
    }

    if(this.price_change > 0) {
      this.ranges.find(range => range.title === 'Цена').value = this.price_change;
    } else {
      this.ranges.find(range => range.title === 'Цена').isActive = false
    }
  },
}
</script>

<style lang="scss" scoped>
  .modal-form {
    margin: 10px;
    display: flex;
    flex-direction: column;
    &-save {
      max-width: 150px;
      margin: 0px auto;
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translate(-50%, 0);
    }
  }
  .modal-form__input-item {
    margin: .42rem auto .42rem auto;
  }
</style>