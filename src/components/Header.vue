<template>
  <header class="header block_container">
    <h1 class="page-title" v-text="header"/>
    <div class="header-right">
      <!-- <div v-if="isShowGoodsSearch || isShowGoodsFolowing" class="education" @click="showTraining">
        <img src="../assets/img/ikons/education.svg" alt="">
        <span class="education__text">Обучение</span>
      </div> -->
      <div class="notifications" >
        <!-- <img src="../assets/img/ikons/notification.svg" alt=""> -->
        <!-- <transition name="fade-notifications" mode="out-in">
          <div v-if="notification" class="notifications__circle"><span></span></div>
        </transition> -->
      </div>
      <transition name="fade-notifications" mode="out-in">
        <div v-if="notification" class="alert" :class="notification.status">
          <span class="alert-dash"></span>
          <div v-if="notification.status === 'success'" class="alert-icon-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M16.455 7.45493C16.6649 7.24684 16.9483 7.12973 17.2439 7.12891C17.5395 7.1281 17.8235 7.24364 18.0346 7.45057C18.2456 7.6575 18.3668 7.93919 18.3718 8.23473C18.3769 8.53028 18.2654 8.81593 18.0615 9.02993L12.0735 16.5149C11.9706 16.6258 11.8464 16.7147 11.7083 16.7765C11.5702 16.8382 11.4211 16.8715 11.2699 16.8743C11.1186 16.8771 10.9684 16.8494 10.8281 16.7928C10.6879 16.7362 10.5604 16.6519 10.4535 16.5449L6.48599 12.5759C6.37546 12.4729 6.28681 12.3487 6.22532 12.2107C6.16383 12.0727 6.13077 11.9238 6.1281 11.7727C6.12544 11.6217 6.15323 11.4716 6.20981 11.3315C6.26639 11.1915 6.35061 11.0642 6.45743 10.9574C6.56426 10.8505 6.69151 10.7663 6.8316 10.7097C6.97168 10.6532 7.12172 10.6254 7.27278 10.628C7.42383 10.6307 7.5728 10.6638 7.7108 10.7253C7.8488 10.7867 7.973 10.8754 8.07599 10.9859L11.217 14.1254L16.4265 7.48793C16.4358 7.47631 16.4458 7.46529 16.4565 7.45493H16.455Z" fill="black"/>
            </svg>
          </div>
          <div class="alert-icon-error" v-if="notification.status === 'error'">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.4099 12L17.7099 7.71C17.8982 7.5217 18.004 7.2663 18.004 7C18.004 6.7337 17.8982 6.47831 17.7099 6.29C17.5216 6.1017 17.2662 5.99591 16.9999 5.99591C16.7336 5.99591 16.4782 6.1017 16.2899 6.29L11.9999 10.59L7.70994 6.29C7.52164 6.1017 7.26624 5.99591 6.99994 5.99591C6.73364 5.99591 6.47824 6.1017 6.28994 6.29C6.10164 6.47831 5.99585 6.7337 5.99585 7C5.99585 7.2663 6.10164 7.5217 6.28994 7.71L10.5899 12L6.28994 16.29C6.19621 16.383 6.12182 16.4936 6.07105 16.6154C6.02028 16.7373 5.99414 16.868 5.99414 17C5.99414 17.132 6.02028 17.2627 6.07105 17.3846C6.12182 17.5064 6.19621 17.617 6.28994 17.71C6.3829 17.8037 6.4935 17.8781 6.61536 17.9289C6.73722 17.9797 6.86793 18.0058 6.99994 18.0058C7.13195 18.0058 7.26266 17.9797 7.38452 17.9289C7.50638 17.8781 7.61698 17.8037 7.70994 17.71L11.9999 13.41L16.2899 17.71C16.3829 17.8037 16.4935 17.8781 16.6154 17.9289C16.7372 17.9797 16.8679 18.0058 16.9999 18.0058C17.132 18.0058 17.2627 17.9797 17.3845 17.9289C17.5064 17.8781 17.617 17.8037 17.7099 17.71C17.8037 17.617 17.8781 17.5064 17.9288 17.3846C17.9796 17.2627 18.0057 17.132 18.0057 17C18.0057 16.868 17.9796 16.7373 17.9288 16.6154C17.8781 16.4936 17.8037 16.383 17.7099 16.29L13.4099 12Z" fill="black"/>
            </svg>
          </div>
          <span class="alert-text">{{ notification.text }}</span>
        </div>
      </transition>
      <!-- <transition name="fade-notifications" mode="out-in">
        <div v-if="notification" class="notifications-wrapper" :class="notification.status">
          <p class="notifications-wrapper-text">{{ notification.text }}</p>
        </div>
      </transition> -->
      <div class="user-name" @click="$router.push({name: 'profile'}).catch(()=>{})">
        <span class="user-name__text">{{email}}</span>
        <img src="../assets/img/ikons/logout.svg" alt="" @click="logout">
      </div>
    </div>
  </header>
</template>

<script>
  import {mapActions} from "vuex";
  import {SHOW_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import TrainingModal from "@/components/TrainingModal";

  export default {
    name: "Header",
    props: {
      header: {
        type: String,
        default: 'Заголовок'
      }
    },
    computed: {
      email() {
        return this.$store.state.user.data?.email;
      },
      notification() {
        return this.$store.getters['notifications/notification']
      },
      isShowGoodsSearch () {
        return this.$route.matched[0] ? this.$route.matched[0].path === '/blackbox' : false
      },
      isShowGoodsFolowing () {
        return this.$route.matched[0] ? this.$route.matched[0].path === '/tracking' : false
      }
    },
    methods: {
      ...mapActions('user', ['logout']),
      showTraining() {
        this.$store.commit(`modal/${SHOW_MODAL_MUTATION}`, {component: TrainingModal})
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/scss/variables";
  
  // .notifications-wrapper {
  //   position: absolute;
  //   right: 200px;
  //   top: 50px;
  //   padding: 12px 24px;
  //   background: #fff;
  //   border-radius: 6px;
  //   z-index: 9999;
  //   border: 1px solid $gray1;
  //   &.success {
  //     & .notifications-wrapper-text {
  //       color: $green;
  //     }
  //   }
  //   &.error {
  //     & .notifications-wrapper-text {
  //       color: $red;
  //     }
  //   }
  // }

  
  .alert {
    position: fixed;
    right: 40px;
    top: 50px;
    padding: .75rem .9rem;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 6px;
    z-index: 100;
    border: 1px solid $gray1;
    display: flex;
    align-items: center;
    z-index: 99999;
    & .alert-dash {
      display: block;
      height: 20px;
      width: 2px;
      border: 1px solid red;
      position: absolute;
      left: 0px;
      top: 50%;
      transform: translate(0, -50%);
      border-left: 1px solid;
      border-right: 2px solid;
      border-bottom-right-radius: 3px;
      border-top-right-radius: 3px;
    }
    &.success {
      box-shadow: 0px 0px 5px -1px rgba(37, 156, 8, .3);
      border: 1px solid rgba(36, 241, 6, 0.46);
      & .alert-text {
        color:#0ad406;
        text-shadow: 1px 1px rgba(0, 4, 10, .1);
      }
      & .alert-dash { 
        border-color: #0ad406
      }
    }
    &.error {
      box-shadow: 0px 0px 5px -1px rgba(255, 3, 3, .3);
      border: 1px solid rgba(241, 6, 6, 0.81);
      & .alert-text {
        color: #ff0303;
        text-shadow: 1px 1px rgba(0, 4, 10, .1);
      }
      & .alert-dash { 
        border-color: #ff0303
      }
    }
    &-text {
      user-select: none;
      margin-left: 5px;
    }
    &-icon-success svg {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2px;
    }
    &-icon-success path {
      fill: #0ad406;
    }
    &-icon-error svg {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2px;
    }
    &-icon-error path {
      fill: #ff0303;
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1.21rem;
  }

  .header-right {
    flex: 1 0 auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .education {
    display: flex;
    align-items: center;
    margin-right: 2.28rem;
    cursor: pointer;
  }

  .education__text {
    margin-left: .42rem;
    color: black;
  }

  .notifications {
    position: relative;
    margin-right: 2.28rem;
  }


  .notifications__circle {
    width: 10px;
    height: 10px;
    border-radius: 100%;
    background: $white;
    position: absolute;
    top: -4px;
    right: -4px;

    span {
      width: 6px;
      height: 6px;
      border-radius: 100%;
      background: $blue;
      display: block;
      margin: 2px 0 0 2px;
    }
  }

  .user-name {
    display: flex;
    align-items: center;
    border-left: 1px solid $drayDevider;
    cursor: pointer;

    img {
      cursor: pointer;
    }
  }

  .user-name__text {
    margin: 0 .85rem 0 1.85rem;
    padding: .57rem 0;
  }

  .fade-notifications-enter-active, .fade-notifications-leave-active {
    transition: opacity .5s;
  }

  .fade-notifications-enter, .fade-notifications-leave-to {
    opacity: 0;
  }
  @media screen and (max-width: 600px) {
    .notifications {
      margin-right: 10px;
    }
    .user-name__text {
      margin-left: 10%;
    }
  }
  @media screen and (max-width: 470px) {
    .header {
      flex-wrap: wrap-reverse;
    }
    .header-right {
      width: 100%;
    }
    .page-title {
      margin: 0px auto;
      margin-top: 20px;
    }
  }
</style>