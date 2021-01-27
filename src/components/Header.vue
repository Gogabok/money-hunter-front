<template>
  <header class="header block_container">
    <h1 class="page-title" v-text="header"/>
    <div class="header-right">
      <!-- <div v-if="isShowGoodsSearch || isShowGoodsFolowing" class="education" @click="showTraining">
        <img src="../assets/img/ikons/education.svg" alt="">
        <span class="education__text">Обучение</span>
      </div> -->
      <!-- <div class="notifications" >
        <img src="../assets/img/ikons/notification.svg" alt=""> -->
        <!-- <transition name="fade-notifications" mode="out-in">
          <div v-if="notification" class="notifications__circle"><span></span></div>
        </transition> -->
      <!-- </div> -->
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

      <!-- <div class="user-name" @click="$router.push({name: 'profile'}).catch(()=>{})">
        <span class="user-name__text">{{email}}</span>
        <img src="../assets/img/ikons/logout.svg" alt="" @click="logout">
      </div> -->
      <div class="user-menu" v-out="isMenuOpen">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
          @click="isMenuOpen = !isMenuOpen"
          class="user-menu-icon"
          width="40" height="40"
          viewBox="0 0 172 172"
          style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#23242a"><path d="M86,6.90688c-43.65602,0 -79.12,35.46398 -79.12,79.12c0,43.65603 35.46397,79.12 79.12,79.12c43.65603,0 79.12,-35.46397 79.12,-79.12c0,-43.65602 -35.46398,-79.12 -79.12,-79.12zM86,13.78688c39.93779,0 72.24,32.3022 72.24,72.24c0,19.72048 -7.89824,37.55807 -20.68031,50.58547c-6.29445,-4.62102 -13.9672,-6.93955 -20.46531,-9.25172c-3.65971,-1.30221 -6.95021,-2.59266 -9.3525,-4.03125c-2.3007,-1.37776 -3.57837,-2.79361 -4.25297,-4.42094c-0.31596,-3.9452 -0.25197,-7.12133 -0.22844,-10.87094c0.41676,-0.41506 0.95142,-0.70667 1.37735,-1.20937c1.00444,-1.18553 2.02714,-2.62612 3.00328,-4.24625c1.67386,-2.77815 2.89186,-6.17617 3.57437,-9.62125c1.04222,-0.53127 2.15558,-0.64624 3.00328,-1.72672c1.56511,-1.99488 2.62165,-4.80225 3.09062,-8.71422c0.41587,-3.45393 -0.69696,-5.8295 -2.12984,-7.65265c1.54149,-5.03898 3.44997,-13.0525 2.80172,-21.34547c-0.35663,-4.56249 -1.50468,-9.15496 -4.2664,-12.97391c-2.63665,-3.64599 -6.91734,-6.2668 -12.3961,-7.21594c-3.47976,-3.95076 -9.00737,-5.81172 -15.61438,-5.81172h-0.03359h-0.02688c-14.80144,0.27174 -24.35153,6.39785 -28.44047,15.74203c-3.8882,8.88544 -3.05232,19.94718 -0.26203,31.4639c-1.49993,1.82328 -2.6749,4.24418 -2.25078,7.79375c0.47074,3.91065 1.52668,6.71918 3.09062,8.71422c0.84708,1.08057 1.96057,1.19515 3.00328,1.72672c0.68241,3.44239 1.90065,6.8358 3.57437,9.61453c0.97614,1.6206 1.99779,3.05975 3.00328,4.24625c0.42603,0.50272 0.96009,0.80079 1.37735,1.2161c0.02236,3.74764 0.08591,6.92253 -0.22844,10.87094c-0.67328,1.62133 -1.94926,3.03793 -4.24625,4.42094c-2.39848,1.44412 -5.68503,2.74173 -9.33906,4.05141c-6.49125,2.32659 -14.15968,4.66176 -20.47203,9.245c-12.7899,-13.02857 -20.69375,-30.87159 -20.69375,-50.59891c0,-39.93779 32.30221,-72.24 72.24,-72.24zM85.73125,34.40672c6.34379,0.00654 10.33515,1.88481 11.4286,3.80281l0.83984,1.4714l1.67297,0.22844c4.32126,0.60044 6.73568,2.27734 8.46563,4.66953c1.72995,2.39219 2.69004,5.73073 2.98312,9.48016c0.58618,7.49885 -1.5604,16.35397 -2.92265,20.45187l-0.86672,2.60016l2.34484,1.42437c-0.23853,-0.14524 1.10247,0.64855 0.79953,3.16453c-0.36694,3.06091 -1.14913,4.61998 -1.67297,5.28765c-0.52383,0.66768 -0.74808,0.5824 -0.69203,0.57781l-2.83531,0.23516l-0.30235,2.82859c-0.25948,2.43024 -1.62635,5.74511 -3.225,8.39844c-0.79933,1.32666 -1.64976,2.50848 -2.365,3.35266c-0.71524,0.84418 -1.47694,1.36705 -1.18922,1.21609l-1.84094,0.96078v2.08281c0,4.55566 -0.1856,8.28108 0.29562,13.58531l0.04031,0.45687l0.16125,0.43c1.35375,3.6431 4.17952,6.21342 7.35703,8.11625c3.1775,1.90283 6.82296,3.27822 10.58203,4.61578c6.19529,2.20442 12.65343,4.3738 17.57625,7.57875c-12.54323,10.50618 -28.69975,16.8439 -46.3661,16.8439c-17.65951,0 -33.81147,-6.3316 -46.35265,-16.83047c4.95077,-3.18656 11.41854,-5.36207 17.60312,-7.57875c3.75659,-1.34643 7.3925,-2.72767 10.56188,-4.63594c3.16938,-1.90827 5.98504,-4.47816 7.33687,-8.10953l0.16125,-0.43l0.04031,-0.45687c0.47728,-5.30014 0.29562,-9.02625 0.29562,-13.58531v-2.08281l-1.84094,-0.9675c0.2881,0.15071 -0.47374,-0.37181 -1.18922,-1.21609c-0.71548,-0.84428 -1.56567,-2.01889 -2.365,-3.34594c-1.59865,-2.65409 -2.96562,-5.9716 -3.225,-8.39844l-0.30235,-2.82859l-2.83531,-0.23516c0.05315,0.00447 -0.16877,0.08972 -0.69203,-0.57781c-0.52328,-0.66751 -1.30436,-2.22543 -1.67297,-5.28765c-0.30069,-2.5165 1.05536,-3.31997 0.79953,-3.16453l2.18359,-1.3236l-0.63828,-2.47922c-2.95996,-11.39227 -3.40757,-21.75796 -0.36281,-28.71594c3.04175,-6.9511 9.13485,-11.36116 22.22562,-11.61z"></path></g></g></svg>
        <transition name="fade-notifications" mode="out-in">
          <div 
            v-show="isMenuOpen" 
            class="user-menu-wrapper"
          >
            <div v-if="user" class="user-menu-wrapper-header">
              <span v-if="userName" class="user-menu-wrapper-header-name">
                {{ userName }}
              </span>
              <span v-if="user.email" class="user-menu-wrapper-header-email">
                {{ user.email }}
              </span>
            </div>
            <div class="user-menu-wrapper-body">
              <span class="user-menu-wrapper-body-profile" @click="toProfile">
                <img src="../assets/img/ikons/nav-ikon_3.svg" alt=""> Профиль
              </span>
              <span class="user-menu-wrapper-body-exit" @click="logOut">
                <img src="../assets/img/ikons/logout.svg" alt=""> Выйти
              </span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script>
  import {mapActions} from "vuex";
  import {SHOW_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import {AuthService} from "@/services/auth_service";
  import TrainingModal from "@/components/TrainingModal";
  import Vue from "vue";
  Vue.directive('out', {
    bind: function (el, binding, vNode) {
        const handler = (e) => {
            if (!el.contains(e.target) && el !== e.target) {
                //and here is you toggle var. thats it
                vNode.context[binding.expression] = false
            }
        }
        el.out = handler
        document.addEventListener('click', handler)
    },

    unbind: function (el) {
        document.removeEventListener('click', el.out)
        el.out = null
    }
  })

  export default {
    name: "Header",
    props: {
      header: {
        type: String,
        default: 'Заголовок'
      }
    },
    data: () => ({
      isMenuOpen: false,
      userName: null
    }),
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
      },
      user() {
        return this.$store.state.user.data;
      },
    },
    mounted() {
      if(this.user) {
        this.userName = this.user.userName
      }
    },
    watch: {
      user: {
        handler: function () {
          if(this.userName === null) {
            this.userName = this.user.userName
          }
        },
        deep: true
      }
    },
    methods: {
      ...mapActions('user', ['logout']),
      showTraining() {
        this.$store.commit(`modal/${SHOW_MODAL_MUTATION}`, {component: TrainingModal})
      },
      toProfile() {
        this.isMenuOpen = false;
        this.$router.push({name: 'profile'})
      },
      logOut() {
        this.isMenuOpen = false;
        // this.$store.dispatch('logout')
        const service = new AuthService();
        service.logout()

        if(this.$route.path !== '/auth/login') {
          this.$router.push('/auth/login')
        }
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

  .user-menu {
    border-left: 1px solid $drayDevider;
    padding: 0px 0px 0px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    &-icon {
      width: 40px;
      height: 40px;
      opacity: .8;
      cursor: pointer;
    }
    &-wrapper {
      top: 50px;
      right: 5px;
      z-index: 106;
      border-radius: 4px;
      box-shadow: 0 1px 8px rgba(0,0,0,.5);
      position: absolute;
      background: #fff;
      font-size: 14px;
      width: 200px;
      &-header {
        padding: 10px 10px;
        border-bottom: 1px solid #DFE0EB;
        user-select: none;
        &-name {
          font-weight: 700;
          display: block;
        }
        &-email {
          display: block;
          font-size: 12px;
          color: #9da3af;
          font-weight: 400;
        }
      }
      &-body {
        padding: 10px 10px;
        color: #9FA2B4;
        font-weight: 500;
        font-size: 16px;
        display: flex;
        flex-direction: column;
        user-select: none;
        &-profile {
          display: flex;
          margin: 10px 0px;
          cursor: pointer;
          & img {
            margin-right: 10px;
            width: 20px;
          }
        }
        &-exit {
          display: flex;
          margin: 10px 0px;
          cursor: pointer;
          & img {
            margin-right: 8px;
            width: 18px;
            margin-left: 2px;
          }
        }
      }
    }
  }
</style>