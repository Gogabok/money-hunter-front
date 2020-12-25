<template>
  <Modal :title='`Группа "${title}"`' closable @next="updateHandler">
    <template v-slot:default>

      <form action="" class="modal-form">
        <ValidationProvider v-slot="{errors}" :rules="{required: true}" ref="validation">
          <div class="modal-form__save-project">
            <InputField label="Введите новое имя группы" v-model="newName" :error="$getValidationError(errors)"/>
          </div>


          <div class="modal-form__submit-item">
            <Btn label="Далее" type="button" @click="updateHandler"/>
          </div>
        </ValidationProvider>
      </form>

    </template>
  </Modal>
</template>

<script>
  import Modal from "../Modal";
  import {ValidationProvider} from 'vee-validate';
  import InputField from "../../shared-components/InputField";
  import Btn from "../../shared-components/Btn";
  import {UPDATE_GROUP_NAME_ACTION} from "../../store/modules/tracking/constants";
  import {HIDE_MODAL_MUTATION, SHOW_MODAL_MUTATION, SET_MODAL_RESPONSE_MUTATION} from "@/store/modules/modal/constants";
  import {mapMutations} from "vuex";

  export default {
    name: "ChangeGroupName",
    props: {
      title: {
        type: String,
        required: true,
      }
    },
    data() {
      return {
        newName: '',
      }
    },
    components: {Btn, InputField, Modal, ValidationProvider},
    methods: {
      async updateHandler() {
        if (!this.$validationProviderIsValid(this.$refs.validation)) {
          return;
        }

        const res = await this.$store.dispatch(`tracking/${UPDATE_GROUP_NAME_ACTION}`, {
          groupName: this.title,
          newName: this.newName
        });
        if (res) {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Группа переименована', status: 'success'})
          // this[SHOW_MODAL_MUTATION]({component: Warning, data: {title: 'Группа переименована'}});
          this.$store.commit(`modal/${HIDE_MODAL_MUTATION}`);
        } else {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: res, status: 'error'})
          // this[SHOW_MODAL_MUTATION]({component: Warning, data: {title: res}});
        }
      },
      ...mapMutations('modal', [SET_MODAL_RESPONSE_MUTATION]),
      ...mapMutations('modal', [SHOW_MODAL_MUTATION])
    }
  }
</script>

<style scoped>

</style>