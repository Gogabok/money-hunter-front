<template>
  <Fragment>
    <ValidationObserver v-slot="{handleSubmit}">
      <form action="" class="modal-form" @submit.prevent="handleSubmit(register)">
        <template v-if="!confirmMessage">
          <div class="modal-form__input-item">
            <ValidationProvider v-slot="{errors}" name="E-mail" :rules="{required: true, email: true}">
              <InputField label="E-mail"
                          clazz="input-field__input_mail"
                          v-model="login"
                          @input="loginError=''"
                          :error="loginError || $getValidationError(errors)"/>
            </ValidationProvider>
          </div>
          <div class="modal-form__input-item">
            <ValidationProvider :rules="{required: true, min: 6}" v-slot="{errors}" name="Пароль">
              <InputField label="Пароль"
                          clazz="input-field__input_password"
                          v-model="password"
                          type="password"
                          @input="passwordError=''"
                          :error="passwordError || $getValidationError(errors)"/>
            </ValidationProvider>
          </div>
          <div class="modal-form__input-item">
            <ValidationProvider :rules="{required: true, min: 6}" v-slot="{errors}" name="Подтверждение пароля">
              <InputField label="Подтверждение пароля"
                          clazz="input-field__input_password"
                          v-model="passwordConfirm"
                          type="password"
                          @input="checkingConfirmPass"
                          :error="passwordConfirmError || $getValidationError(errors)"/>
            </ValidationProvider>
          </div>
          <div class="modal-form__input-item">
            <ValidationProvider name="Имя" :rules="{required: true}" v-slot="{errors}">
              <InputField label="Имя"
                          clazz="input-field__input_name"
                          :error="nameError || $getValidationError(errors)"
                          v-model="name"
                          @input="nameError=''"
              />
            </ValidationProvider>
          </div>
          <div class="modal-form__input-item">
            <ValidationProvider name="Телефонный номер" :rules="{phonenumber: true, required: true}" v-slot="{errors}">
              <InputField label="Телефонный номер"
                          clazz="input-field__input_phone"
                          :error="phoneNumberError || $getValidationError(errors)"
                          v-model="phoneNumber"
                          @input="phoneNumberError=''"
                          placeholder="8 (___) ___-__-__"
                          :mask="'8 (###) ###-##-##'"
              />
            </ValidationProvider>
          </div>
          <div class="modal-form__promocod-item">
            <div class="modal-form__promocod-link"
                 @click="showPromotionField=!showPromotionField"
                 v-if="!showPromotionField">
              У меня есть промокод
            </div>
            <template v-if="showPromotionField">
              <InputField :buttonLabel="'Применить'" @button-event="promocodeCheking" :label="`Промокод${codeText ? '. ' + codeText : ''}`" type="text" :clazz="`input-field__input ${codeStatus}`" placeholder="Введите промокод" v-model="code"/>
              <!-- <button @click="promocodeCheking" class="modal-form__promocod-done" type="button"/> -->
            </template>
          </div>
          <a class="modal-form__agreement" target="_blank" href="https://moneyhunter.pro/agreement/">Пользовательское соглашение</a>
          <div class="modal-form__submit-item">
            <Btn :loading="loading" :isDisabled="isDisabled" label="Зарегистрироваться" type="submit"/>
          </div>
          <div class="modal-form__links modal-form__links_align-center">
            <router-link :to="{name: 'auth.login'}">Уже есть учетная запись? Войти</router-link>
          </div>
        </template>
        <template v-else>
          <div class="modal-form__success-reset-password">{{ successText }}
          </div>
          <div class="modal-form__submit-item">
            <Btn label="Хорошо" @click="$router.push({name: 'root'})"/>
          </div>
        </template>
      </form>
    </ValidationObserver>
  </Fragment>
</template>

<script>
  import InputField from "@/shared-components/InputField";
  import Btn from "@/shared-components/Btn";
  import {Fragment} from 'vue-fragment';
  import {AuthService} from "@/services/auth_service";
  import {ValidationObserver, ValidationProvider} from 'vee-validate';

  export default {
    name: "Register",
    components: {Fragment, InputField, Btn, ValidationProvider, ValidationObserver},
    data() {
      return {
        confirmMessage: false,

        showPromotionField: false,

        loginError: null,
        passwordError: null,
        phoneNumberError: null,
        nameError: null,
        passwordConfirmError: null,

        login: '',
        password: '',
        code: '',
        phoneNumber: '',
        name: '',
        
        codeStatus: null,

        codeText: '',

        loading: false,

        passwordConfirm: ''
      }
    },
    computed: {
      successText() {
        const text = `Мы отправили сообщение на адрес ${this.login}.
            Пожалуйста, проверьте свой почтовый ящик и следуйте инструкциям.`
        return text
      },
      isDisabled() {
        let isError = false
        const errors = ["loginError", "passwordError", "phoneNumberError", "nameError", "passwordConfirmError"]
        errors.forEach(error => {
          if(this[error]) {
            isError = true
          }
        })
        return isError
      }
    },
    methods: {
      async register() {
        this.loading = true
        const fields = ['login', 'password', 'phoneNumber', 'name']
        fields.forEach(elem => {
          if(this[elem] === '') {
            this[`${elem}Error`] = 'Обязательно для заполнения'
          }
        });
        if(!this.isDisabled) {
          const service = AuthService.getInstance();
          const status = await service.register(this.login, this.password, this.name, this.phoneNumber, this.code);
          if (typeof status === 'boolean' && status) {
            this.confirmMessage = true;
            if(this.codeStatus === 'valid') {
              await service.setPromocode(this.code, this.login);
            }
          } else {
            this.loginError = status;
          }
        }
        this.loading = false
      },
      checkingConfirmPass() {
        if(this.password !== this.passwordConfirm) {
          this.passwordConfirmError = 'Пароли не совпадают'
        } else {
          this.passwordConfirmError = null
        }
      },
      async promocodeCheking () {
        const fields = ['login', 'password', 'phoneNumber', 'name']
        let isError = false
        fields.forEach(elem => {
          if(this[elem] === '') {
            this[`${elem}Error`] = 'Обязательно для заполнения'
            isError = true
          }
        });
        if(!isError) {
          const service = AuthService.getInstance();
          this.code = this.code.toUpperCase()
          const promocodeStatus = await service.getPromocode(this.code)
          if(promocodeStatus.status === 200) {
            this.codeStatus = 'input-field__input_success'
            this.codeText = promocodeStatus.data.detail
            await service.setPromocode(this.promocode, this.user.email);
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Промокод активирован', status: 'success'})
          } else {
            this.codeStatus = 'input-field__input_error'
            this.codeText = promocodeStatus.data.detail
          }
        }
      }
    }
  }
</script>

<style scoped>
  .valid {
    color: green
  }
  .notValid {
    color: red;
  }
  .promocode-status {
    text-align: center;
    margin-top: 10px;
  }
  .modal-form__agreement {
    color: #ff8562;
    text-align: center;
    margin-top: 15px;
  }
</style>