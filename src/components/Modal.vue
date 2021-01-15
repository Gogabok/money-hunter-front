<template>
  <Fragment>
    <div class="overlay"></div>
    <div class="modal" :class="clazz">
      <div class="close-modal" v-if="closable" @click="hideModal" v-on:click="closeModal"></div>
      <slot name="logo"><span/></slot>
      <div class="modal-title" v-html="title"></div>
      <slot/>
    </div>
  </Fragment>
</template>

<script>
  import {Fragment} from 'vue-fragment';
  import {mapMutations} from "vuex";
  import {HIDE_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import {Stream} from "@/helpers/stream.fn";

  export default {
    name: "Modal",
    components: {Fragment},
    props: {
      title: {
        type: String,
        required: true
      },
      closable: {
        type: Boolean,
        default: false
      },
      clazz: {
        type: String,
        required: false,
        default: 'modal_small',
      }
    },
    data() {
      return {
        escStream: new Stream(),
        nextStream: new Stream(),
      }
    },
    methods: {
      ...mapMutations('modal', [HIDE_MODAL_MUTATION]),
      /**
       *
       * @param {KeyboardEvent} event
       */
      handleKeyboardEvent(event) {
        // "keyCode" депрецирован, но IE не поддерживает "key"

        if (event.key === 'Escape' || event.keyCode === 27) {
          this.escStream.next();
        }
        if (event.key === 'Enter' || event.keyCode === 13) {
          this.nextStream.next();
        }
      },
      onNext() {
        this.$emit('next');
      },
      closeModal() {
        this.$emit('modalClose')
      }
    },
    mounted() {
      document.addEventListener('keydown', this.handleKeyboardEvent);
      this.escStream.subscribe(this.hideModal);
      this.nextStream.subscribe(this.onNext);
    },
    beforeDestroy() {
      document.removeEventListener('keydown', this.handleKeyboardEvent);
      this.escStream.unsubscribe(this.hideModal);
      this.nextStream.unsubscribe(this.onNext);
    }
  }
</script>

<style lang="scss">
  @import "../assets/scss/variables.scss";

  .overlay {
    position: fixed;
    z-index: 100;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, .5);
  }

  .modal {
    z-index: 101;
    min-width: 39.28rem;
    max-height: calc(100% - (5.57rem * 2));
    border-radius: 30px;
    background: white;
    padding: 4rem 0 4.35rem;
    position: fixed;
    top: 5.57rem;
    left: 50%;
    transform: translateX(-50%);
    // overflow-y: auto;
    display: flex;
    flex-direction: column;

    &.modal_small {
      max-width: 39.28rem;
    }
    &.large_modal {
      max-width: calc(100vw - 10rem);
      width: 100%;
    }

    &.modal_big {
      max-width: 42.85rem;
    }

    @media screen and (max-height: 740px) {
      & {
        padding: 15px 0px;
        top: 2%;
        overflow: auto;
        max-height: 96%;
      }
    }
    @media screen and (max-width: 39.28rem) {
      & {
        width: 100%;
        max-width: 100% !important;
      }
    }
  }

  .close-modal {
    cursor: pointer;
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 1.71rem;
    height: 1.71rem;
    background: url("../assets/img/ikons/close.svg") no-repeat;
  }

  .modal-company {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2.14rem;

    span {
      font-size: 1.78rem;
      font-weight: bold;
      letter-spacing: .512px;
      color: $titleColor;
      margin-left: 1rem;
    }
  }

  .modal-title {
    font-size: 1.71rem;
    font-weight: bold;
    letter-spacing: .3px;
    color: black;
    text-align: center;
    padding: 0px 10px;
    line-height: 1;
  }

  .modal-form {
    margin: 1.71rem 7.14rem 0;
    border-top: 1px solid $drayDevider;
    padding-top: 1.42rem;
    display: flex;
    flex-direction: column;
    flex: 1;
    max-height: 100%;
    overflow: hidden;
    @media screen and (max-height: 740px) {
      & {
        margin-top: 10px;
        padding-top: 10px;
        overflow: visible;
      }
    }
    @media screen and (max-width: 500px) {
      & {
        margin: 10px;
      }
    }
  }


  .modal-form__input-item {

    &:not(:first-child) {
      margin-top: .85rem;
    }
  }

  .modal-form__submit-item {
    margin-top: 1.57rem;
  }

  .modal-form__links {
    display: flex;
    justify-content: space-between;
    margin-top: 1.35rem;

    &.modal-form__links_align-center {
      justify-content: center;
    }

    a {
      color: $blue;
      text-decoration: underline;
      letter-spacing: .2px;

      &:last-child {
        text-align: right;
      }
    }
  }

  .modal-form__promocod-item {
    position: relative;
    margin-top: 1.5rem;
  }

  .modal-form__promocod-link {
    cursor: pointer;
    text-align: center;
    font-weight: bold;
    letter-spacing: .2px;
    color: $titleColor;
    text-decoration: underline;
  }

  .modal-form__promocod-done {
    cursor: pointer;
    position: absolute;
    width: 2.85rem;
    height: 2.85rem;
    border-radius: 0px 4px 4px 0px;
    background: url("../assets/img/ikons/promocod_arrow.svg") no-repeat center, $yellow;
    right: 0px;
    bottom: 0px;
  }

  .modal-form__success-reset-password {
    margin-top: 2.14rem;
    text-align: center;
    color: $green;
    letter-spacing: .2px;
  }

  .modal-form__save-project {
    // margin-top: 1.42rem;

    label {
      text-align: center;
      margin-bottom: .92rem;
    }
  }

  .modal-form__double-submit {
    display: flex;
    justify-content: space-between;

    &.modal-form__double-submit_save-project {
      margin-top: 2.71rem;
    }

    &.modal-form__double-submit_download-project {
      margin-top: 1.78rem;
    }

    @media screen and (max-height: 740px) {
      &.modal-form__double-submit_save-project {
        margin-top: 10px;
      }
    }
  }

  .modal-form__double-submit-item {
    flex-basis: calc((100% - 3.14rem) / 2);
  }

  .modal-form__download-project {
    /*margin-top: 1.92rem;*/
    flex: 1;
    max-height: 100%;
    overflow-y: auto;
  }

  .modal-form__download-project-item {

    &:not(:last-child) {
      margin-bottom: .71rem;
    }
  }

  .modal-form-steps {
    margin-top: 1.64rem;
    display: flex;
    justify-content: space-between;
    position: relative;
    padding: 0 7.14rem;
    @media screen and (max-width: 500px) {
      & {
        padding-left: 10px;
        padding-right: 10px;
      }
    }
  }

  .modal-form-steps__line {
    position: absolute;
    z-index: -1;
    width: 47%;
    height: 1px;
    border-bottom: 1px solid $drayDevider;
    top: 1.28rem;
    left: 50%;
    transform: translateX(-50%);
     @media screen and (max-width: 500px) {
      & {
        width: 100%;
      }
    }
  }

  .modal-form-steps__item {
    display: flex;
    flex-direction: column;
    align-items: center;

    &.modal-form-steps__item_active {

      .step-circle {
        border-color: $yellow;
        color: $yellow;
      }

      .step-name {
        color: black;
      }
    }

    &.modal-form-steps__item_success {

      .step-circle {
        background: url("../assets/img/ikons/check.svg") no-repeat center, $yellow;
        color: transparent;
        border-color: $yellow;
      }

      .step-name {
        color: rgba(183, 185, 199, .8);
      }
    }
  }

  .step-circle {
    width: 2.57rem;
    height: 2.57rem;
    border-radius: 100%;
    border: 2px solid $drayDevider;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $drayDevider;
    font-weight: bold;
  }

  .step-name {
    margin-top: .42rem;
    color: rgba(183, 185, 199, .8);
    font-weight: 500;
    font-size: 1.14rem;
    letter-spacing: .3px;
  }

  .modal-form-search {
    margin-top: 2.85rem;
  }

  .modal-form-search__not {
    text-align: center;
    color: $titleColor;
    font-size: bold;
    letter-spacing: .2px;
    font-weight: bold;

    img {
      margin: 0 auto 2.71rem;
    }
  }

  .modal-form-product {
    margin-top: 1.42rem;
  }

  .modal-form-category {
    margin-top: 1.42rem;
    padding-bottom: 1.42rem;
    border-bottom: 1px solid $drayDevider;
    @media screen and (max-height: 740px) {
      & {
        margin-top: 0px;
      }
    }
  }

  .modal-form__category-list {
    margin-top: 1.07rem;
    overflow-y: auto;
    max-height: 100px;
  }

  .modal-tabs {
    width: 100%;
    border-bottom: 1px solid $drayDevider;
    display: flex;
    justify-content: center;
    margin-top: 35px;
  }

  .modal-tabs__item {
    padding: 0 20px 15px;
    margin: 0 35px;

    span {
      color: #C5C7D2;
      letter-spacing: .3px;
      font-size: 1.14rem;
      font-weight: 500;
    }
  }
  @media screen and (max-width: 550px) {
    .modal {
      min-height: 100vh;
      border-radius: 0px;
      top: 0px;
      min-width: 100%;
      max-width: 100%;
      width: 100%;
    }
  }
</style>
