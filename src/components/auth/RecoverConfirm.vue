<template>
  <ValidationObserver v-slot="{handleSubmit}">
    <form action="" class="modal-form" @submit.prevent="handleSubmit(handleRecoverRequest)">
      <div class="modal-form__input-item">
        <ValidationProvider :rules="{required: true, min: 6}" v-slot="{errors}" name="Пароль">
          <InputField label="Введите новый пароль"
                      clazz="input-field__input_password"
                      v-model="password"
                      type="password"
                      :error="$getValidationError(errors)"/>
        </ValidationProvider>
      </div>
      <div class="modal-form__submit-item">
        <Btn :loading="loading" label="Восстановить" type="submit"/>
      </div>
      <div class="modal-form__links modal-form__links_align-center">
        <router-link :to="{name: 'auth.login'}">Авторизоваться</router-link>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
  import {ValidationObserver, ValidationProvider} from 'vee-validate';
  import InputField from "../../shared-components/InputField";
  import Btn from "../../shared-components/Btn";
  import {AuthService} from "@/services/auth_service";
  import {SHOW_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import {mapMutations} from "vuex";

  export default {
    name: "RecoverConfirm",
    data() {
      return {
        password: '',
        
        loading: false
      }
    },
    components: {Btn, InputField, ValidationObserver, ValidationProvider},
    methods: {
      async handleRecoverRequest() {
        this.loading = true
        const service = AuthService.getInstance();
        const response = await service.setPassword(
          this.password,
          this.$route.params.uidb64,
          this.$route.params.token
        );

        if (response) {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Пароль успешно изменен', status: 'success'})
          // this[SHOW_MODAL_MUTATION]({component: Warning, data: {title: 'Пароль успешно изменен'}});
          await this.$router.push({name: 'auth.login'});
        } else {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Произошла ошибка', status: 'error'})
          // this[SHOW_MODAL_MUTATION]({component: Warning, data: {title: 'Произошла ошибка'}});
        }
        
        this.loading = false
      },
      ...mapMutations('modal', [SHOW_MODAL_MUTATION])
    }
  }
</script>

<style scoped>

</style>