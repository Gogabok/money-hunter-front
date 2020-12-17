<template>
  <Modal title="Добавить оповещение" closable>
    <template v-slot:default>
    </template>
  </Modal>
</template>

<script>
import Modal from "../Modal.vue";

export default {
  name: "AddNotification",
  props: [
      'nested'
  ],
  components: {
    Modal
  },
  mounted() {
    console.log(this.nested);
  }
}
</script>

<style scoped>

</style>