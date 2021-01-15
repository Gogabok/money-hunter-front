<template>
  <Modal title="Сохранить фильтр" @next="saveHandler">
    <template v-slot:default>
      <ValidationProvider v-slot="{errors}" :rules="{required: true}" ref="validation">
        <form action="" class="modal-form" @submit.prevent>

          <div class="radio-item" v-for="(search, idx) in userSavedSearches" :key="idx"
               @click="isNewGroup = false; name = search.data.name">
            <input type="radio"
                   :value="name"
                   :checked="name===search.data.name && !isNewGroup" /><label for="">{{search.data.name}}</label>
          </div>
          <div class="radio-item">
            <input type="radio" :checked="isNewGroup" @click="name = ''; isNewGroup = true">
            <input type="text"
                   class="input-field__input"
                   @input="name = $event.target.value"
                   @click="name = isNewGroup ? name : ''; isNewGroup = true;"
                   :value="isNewGroup ? name : ''"
                   :error="nameError || $getValidationError(errors)"
                   placeholder="Название нового фильтра">
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
import Btn from "../../shared-components/Btn";
import {HIDE_MODAL_MUTATION, SHOW_MODAL_MUTATION, SET_MODAL_RESPONSE_MUTATION} from "@/store/modules/modal/constants";
import {mapMutations, mapState} from "vuex";
import {BlackboxService} from "@/services/blackbox_service";
import {ValidationProvider} from 'vee-validate';

export default {
  name: "SaveProject",
  components: {Btn, Modal, ValidationProvider},
  data() {
    return {
      name: '',
      nameError: null,
      userSavedSearches: [],
      isNewGroup: true,

      loading: false
    }
  },
  computed: {
    ...mapState('modal', ['nested'])
  },
  async created() {
    const blackboxService = new BlackboxService();
    this.userSavedSearches  = await blackboxService.getSavedSearches();
  },
  methods: {
    async saveHandler() {
      this.loading = true

      if (await this.$validationProviderIsValid(this.$refs.validation)) {
        const blackboxService = new BlackboxService();
        const _nested = {...this.nested};

        const result = await blackboxService.saveSearch(this.name, _nested);
        if (typeof result === 'boolean' && result) {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Фильтр сохранен', status: 'success'})
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