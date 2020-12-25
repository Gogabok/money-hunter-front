<template>
  <Btn :disabled="isDisabled" clazz="button_add" label="Настроить оповещения" @click="addNotificationBtnHandler"/>
</template>

<script>
  import Btn from "../../shared-components/Btn";
  import {SHOW_MODAL_MUTATION} from "../../store/modules/modal/constants";
  import AddNotification from "./AddNotification";
  import {mapMutations} from "vuex";
  import {TrackingService} from '../../services/tracking_service';

  export default {
    name: "AddNotificationBtn",
    components: {Btn},
    methods: {
      async addNotificationBtnHandler() {
        try {
          const groupNotificationId = await this.getGroupNotificationId();
          const service = new TrackingService();
          const notification = await service.getGroupNotification(groupNotificationId);
          if(typeof notification === 'string') {
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: notification, status: 'error'})
          } else {
            if(!this.isDisabled) {
              this[SHOW_MODAL_MUTATION]({component: AddNotification, data: {...notification, notification_id: groupNotificationId}});
            }
          }
        } catch(e) {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: "Произошла ошибка", status: 'error'});
        }
      },
      async getGroupNotificationId() {
        try {
          const service = new TrackingService();
          const groups = await service.getUserGroups();
          return groups.find(group => group.name === this.$route.params.name)['notifications_id'];
        } catch(e) {
          return false;
        }
      },
      ...mapMutations('modal', [SHOW_MODAL_MUTATION]),
    },
    computed: {
      isDisabled() {
        return false
      }
    }
  }
</script>

<style scoped>

</style>