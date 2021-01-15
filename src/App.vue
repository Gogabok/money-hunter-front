<template>
  <div id="app" class="root">
    <template v-if="isLoggedIn && notPaymentRoute">
      <Sidebar/>
      <main>
        <Header :header="getTitle()"/>
        <router-view/>
        <div v-if="isTechnicalWorks" class="error-working">
          <p class="error-working-message">{{ technicalMessage }}</p>
        </div>
      </main>
      <component v-bind:is="component" v-if="isShow" v-bind="nested"/>
    </template>
    <!--    login/register and other similar windows-->
    <router-view v-else/>
  </div>
</template>

<script>
  import Sidebar from "@/components/Sidebar";
  import Header from "@/components/Header";
  import {GET_PROFILE_ACTION, GET_SUBSCRIPTION_ACTION} from "@/store/modules/user/constants";
  import {mapActions, mapState} from "vuex";
  import {TokenService} from "@/services/token_service";
  import {LOAD_POSITIONS_ACTION} from "@/store/modules/trackingPositions/constants";
  import {LOAD_GROUPS_ACTION} from "@/store/modules/tracking/constants";
  import {TrackingService} from "@/services/tracking_service";

  export default {
    components: {Sidebar, Header},
    data() {
      return {
        isTechnicalWorks: false,
        technicalMessage: 'Ведутся технические работы'
      }
    },
    computed: {
      ...mapState('auth', ['isLoggedIn']),
      ...mapState('modal', ['isShow', 'component', 'nested']),
      notPaymentRoute() {
        return this.$route.name !== 'payment-results' 
      }
    },
    created() {
      const tokenService = new TokenService();
      const trackingService = new TrackingService();
      if (tokenService.isLoggedIn()) {
        this[GET_PROFILE_ACTION]();
        this[GET_SUBSCRIPTION_ACTION]();
        this[LOAD_GROUPS_ACTION]();
        this[LOAD_POSITIONS_ACTION]();
        trackingService.getBrands();
      }
    },
    methods: {
      getTitle() {
        // Находим ближайший роут, у которого есть title в meta
        return ([...this.$route.matched]
          .reverse()
          .find(route => route.meta && route.meta.title) || {meta: {title: 'Moneyhunter'}})
          .meta
          .title;
      },
      ...mapActions('user', [GET_PROFILE_ACTION, GET_SUBSCRIPTION_ACTION]),
      ...mapActions('tracking', [LOAD_GROUPS_ACTION]),
      ...mapActions('trackingPositions', [LOAD_POSITIONS_ACTION])
    },
    watch: {
      isLoggedIn: function (newState) {
        if (newState) {
          this[GET_PROFILE_ACTION]();
          this[GET_SUBSCRIPTION_ACTION]();
          this[LOAD_GROUPS_ACTION]();
          this[LOAD_POSITIONS_ACTION]();
        }
      }
    }
  }
</script>


<style lang="scss">
  @import "assets/scss/variables";
  @import "assets/scss/media";
  @import '~shepherd.js/dist/css/shepherd.css';

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    outline: none;
    border: none;
    box-shadow: none;
    text-decoration: none;
    color: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }

  html,
  body {
    height: 100%;
    font-family: $mainFont;
    color: $black;
    font-size: $defaultFontSize;
    line-height: 1.43;
    background-color: $white;
    overflow-x: hidden;
  }

  .root {
    height: 100%;
  }

  main {
    padding-left: 5.71rem;
    padding-bottom: 3.57rem;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    position: relative;
    @media screen and (max-width: 568px) {
      padding-top: 60px;
      padding-left: 0px;
    }
  }

  h1 {
    font-size: $defaultH1Size;
    line-height: 1.16;
    font-weight: bold;
  }

  input, textarea, button {
    font-family: $mainFont;
  }

  ul {
    list-style: none;
  }

  .block_container {
    padding: 0 2.28rem;
  }

  .vision-password {
    width: 1.14rem;
    height: 1.14rem;
    background: url("assets/img/ikons/visible.svg") no-repeat;
    position: absolute;
    right: .64rem;
    bottom: .78rem;

    &.vision-password_error {
      background: url("assets/img/ikons/visible_error.svg") no-repeat;
    }

    &.vision-password_visible {
      background: url("assets/img/ikons/no_visible.svg") no-repeat;
    }
  }

  .product-item {
    display: flex;
  }

  .product-info {
    margin-left: .92rem;
  }

  .product.name {
    letter-spacing: .2px;
  }

  .product-code {
    margin-top: 3px;
    color: $titleColor;
    letter-spacing: .2px;
  }

  .radio-item {
    display: flex;
    align-items: center;
    margin-bottom: .92rem;
    padding-right: 2.71rem;

    &:last-child {
      margin-bottom: 0;
    }

    label {
      margin-left: .78rem;
    }

    .input-field__input {
      flex: 0 0 100%;
      margin-left: .78rem;
    }
  }
  .error-working {
    position: fixed;
    top: 0px;
    width: calc(100% + 52px);
    min-height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    z-index: 99999;
    left: -52px;
  }
  .error-working-message {
    color: #fff;
    font-weight: 500;
    font-size: 32px;
  }
  @media screen and (max-width: 770px) {
    .error-working-message {
      font-size: 16px;
    }
  }

  .tour-submit-btn {
    background: #FFC700;
    height: 2.85rem;
    border-radius: 4px;
    width: 100%;
    color: black;
    letter-spacing: .2px;
    padding: 0 .92rem;
    width: 270px;
    max-width: 270px;
    font-size: 13px;
    font-weight: 500;
    &:hover {
      background: #FFC700 !important;
      height: 2.85rem !important;
      border-radius: 4px !important;
      width: 100% !important;
      font-weight: 500 !important;
      color: black !important;
      letter-spacing: .2px !important;
      padding: 0 .92rem !important;
      font-size: 13px !important;
      font-weight: 500 !important;
    }
  }
  .tour-cancel-btn {
    border: 1px solid #DFE0EB;
    border-radius: 4px;
    color: #000;
    padding-left: 1rem;
    padding-right: 1rem;
    height: 2.57rem;
    background: white;
    max-width: 300px;
    width: auto;
    &:hover {
      border: 1px solid #DFE0EB !important;
      border-radius: 4px !important;
      color: #000 !important;
      padding-left: 1rem !important;
      padding-right: 1rem !important;
      height: 2.57rem !important;
      background: white !important;
    }
  }
  .tour-step .tour-submit-btn {
    max-width: 100px;
    width: 100px;
    height: 2.57rem;
    &:hover {
      height: 2.57rem !important;
    }
  }
  .tour-step .tour-cancel-btn {
    max-width: 80px;
    width: 80px;
    height: 2.57rem;
    &:hover {
      height: 2.57rem !important;
    }
  }
  .welcome-step {
    max-width: 600px;
    width: 100%;
    & .shepherd-header {
      background: $black !important;
    }
    & .shepherd-title {
      color: #fff;
      font-weight: 500;
      font-size: 1.3rem;
    }
    & .shepherd-text {
      color: #23242A;
      font-weight: 400;
      font-size: 1.1rem;
      padding: 14px;
    }
  }

  .shepherd-element.shepherd-has-title[data-popper-placement^=bottom]>.shepherd-arrow:before {
    background-color: $black;
  }

  .tour-step {
    max-width: 400px;
    width: 100%;
    & .shepherd-header {
      background: $black !important;
    }
    & .shepherd-title {
      color: #fff;
      font-weight: 500;
      font-size: 1.3rem;
    }
    & .shepherd-text {
      color: #23242A;
      font-weight: 400;
      font-size: 1.3rem;
      padding: 14px;
    }
  }

  .shepherd-footer {
    display: flex;
    align-items: center;
  }
</style>
