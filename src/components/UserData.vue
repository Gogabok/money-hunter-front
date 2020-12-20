<template>
  <div class="user-data block_container">
    <ValidationObserver v-slot="{handleSubmit}">
      <form action="" class="user-data-form">
        <div class="user-data__item">
          <ValidationProvider :rules="{required: true}" v-slot="{errors}">
            <InputField label="ФИО" v-model="userName" :error="$getValidationError(errors)"/>
          </ValidationProvider>
        </div>
        <div class="user-data__item">
          <ValidationProvider :rules="{required: true}" v-slot="{errors}">
            <InputField label="Компания" v-model="companyName" :error="$getValidationError(errors)"/>
          </ValidationProvider>
        </div>
        <div class="user-data__item">
          <ValidationProvider :rules="{required: true, phonenumber: true}" v-slot="{errors}">
            <InputField label="Телефонный номер"
                        v-model="phoneNumber"
                        placeholder="8 (___) ___-__-__"
                        :mask="'8 (###) ###-##-##'"
                        :error="$getValidationError(errors)"/>
          </ValidationProvider>
        </div>
        <div class="user-data__item subscriptionColumn">
          <InputField :buttonLabel="'Отменить подписку'" @button-event="cancelSubscription" label="Ваш тариф" :value="subscriptionType" disabled/>
        </div>
        <div class="user-data__item">
          <InputField :label="isReccurent ? `Дата следующего списания средств` : `Дата окончания действия подписки`" :value="expDate" disabled/>
        </div>
        <div class="user-data__item">
          <template>
            <InputField :label="`Промокод${codeText ? '. ' + codeText : ''}`" type="text" :clazz="`input-field__input ${codeStatus}`" placeholder="Введите промокод" v-model="promocode"/>
            <button @click="setPromocode" class="modal-form__promocod-done" :class="codeStatus" type="button"/>
          </template>
        </div>
        <div class="user-data__item">
          <telegram-notification-input/>
        </div>
      </form>

      <div class="user-data-change">
        <Btn label="Изменить" disabled clazz="button__change" @click="handleSubmit(postUser)"/>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
  import InputField from "../shared-components/InputField";
  import Btn from "../shared-components/Btn";
  import {ValidationObserver, ValidationProvider} from 'vee-validate';
  import {POST_USER_ACTION, SET_USER_MUTATION} from "@/store/modules/user/constants";
  import {SHOW_MODAL_MUTATION, SET_MODAL_RESPONSE_MUTATION} from "@/store/modules/modal/constants";
  import {mapMutations, mapActions} from "vuex";
  import Warning from "@/components/blackbox/Warning";
  import {AuthService} from "@/services/auth_service";
  import CancelSubscrptionAlert from "@/components/CancelSubscrptionAlert";
  import TelegramNotificationInput from "@/shared-components/TelegramNotificationInput"
  import {GET_PROFILE_ACTION, GET_SUBSCRIPTION_ACTION} from "@/store/modules/user/constants";

  export default {
    name: "UserData",
    components: {InputField, Btn, ValidationObserver, ValidationProvider, TelegramNotificationInput},
    data: () => ({
      promocode: '',
      codeStatus: '',
      codeText: ''
    }),
    computed: {
      user() {
        return this.$store.state.user.data;
      },
      userName: {
        get: context => context.user?.userName,
        set(value) {
          this.setUserData('userName', value);
        }
      },
      companyName: {
        get: context => context.user?.companyName,
        set(value) {
          this.setUserData('companyName', value);
        }
      },
      phoneNumber: {
        get: context => context.user?.phoneNumber,
        set(value) {
          this.setUserData('phoneNumber', value);
        }
      },
      subscriptionType() {
        return this.$store.state.user.subscription?.subscriptionType;
      },
      expDate() {
        return this.$store.getters['user/getExpDate']
      },
      isReccurent() {
        return this.$store.getters['user/isReccurent']
      },
    },
    methods: {
      async postUser() {
        const result = await this.$store.dispatch(`user/${POST_USER_ACTION}`);
        if (result) {
          this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Информация сохранена', status: 'success'})
        }
      },
      setUserData(type, value) {
        const payload = {...this.user};

        payload[type] = value;

        this.$store.commit(`user/${SET_USER_MUTATION}`, payload);
      },
      async setPromocode() {
        const service = AuthService.getInstance();
        this.promocode = this.promocode.toUpperCase()
        const promocodeStatus = await service.getPromocode(this.promocode)
        if(promocodeStatus.status === 200) {
          const setPromocodeResult = await service.setPromocode(this.promocode, this.user.email);
          if(setPromocodeResult && setPromocodeResult.non_field_errors) {
            this.codeStatus = 'input-field__input_error'
            this.codeText = setPromocodeResult.non_field_errors[0]
          } else {
            this.codeStatus = 'input-field__input_success'
            this.codeText = promocodeStatus.data.detail
            this.$store.commit('notifications/ADD_NOTIFICATION', {text: 'Промокод активирован', status: 'success'})
            this[GET_PROFILE_ACTION]();
            this[GET_SUBSCRIPTION_ACTION]();
          }
        } else {
          this.codeStatus = 'input-field__input_error'
          this.codeText = promocodeStatus.data.detail
        }
      },
      cancelSubscription() {
        this.$store.commit(`modal/${SHOW_MODAL_MUTATION}`, {component: CancelSubscrptionAlert});
      },
      ...mapMutations('modal', [SET_MODAL_RESPONSE_MUTATION]),
      ...mapMutations('modal', [SHOW_MODAL_MUTATION]),
      ...mapActions('user', [GET_PROFILE_ACTION, GET_SUBSCRIPTION_ACTION]),
    }
  }
</script>

<style scoped lang="scss">
  .user-data {
    margin-top: 1.85rem;
  }

  .user-data-form {
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;
  }

  .user-data__item {
    flex-basis: calc((100% - (2.28rem * 3)) / 4);
    margin: .3rem .85rem;
    position: relative;
  }

  @media screen and (max-width: 1356px) {
    .user-data-form {
      justify-content: space-between;
    }
    .user-data__item {
      flex-basis: calc((100% - 1rem) / 3);
      margin: .5rem 0px;
      position: relative;
    }
  }

  @media screen and (max-width: 1120px) {
    .user-data__item {
      flex-basis: calc((100% - 1rem) / 2);
      margin: .5rem 0px;
      position: relative;
    }
  }
  @media screen and (max-width: 750px) {
    .user-data__item {
      flex-basis: 100%;
      margin: .5rem 0px;
      position: relative;
    }
  }
  @media screen and (max-width: 420px) {
    .user-data {
      padding: 0px 10px;
    }
  }

  .user-data-change {
    width: 12.14rem;
    margin: 2.14rem auto 0;
  }

  .modal-form__promocod-done.input-field__input_error {
    border: 1px solid red;
    border-left-color: transparent
  }
  .modal-form__promocod-done.input-field__input_success {
    border: 1px solid rgba(93, 107, 91, 0.46);
    border-left-color: transparent;
  }
  .subscriptionColumn {
    min-width: 280px;
  }
</style>