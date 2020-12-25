<template>
  <div class="sidebar-folder">
    <div class="sidebar" :class="burgerMenuShowen ? 'active-sidebar' : ''">
      <div class="sidebar-header">
        <img src="../assets/img/logo.svg" alt="">
        <div class="sidebar-header__company-name">Moneyhunter</div>
      </div>
      <div class="sidebar-navigation">
        <nav>
          <ul>
            <li class="sidebar-navigation-item"
                :class="{'sidebar-navigation-item_active': isActive(item.systemName)}"
                v-for="item in links"
                @click="linkTo(item.systemName)"
                :key="item.name">
              <span class="sidebar-navigation-item__text">{{item.name}}</span>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="mobile-sidebar">
      <svg @click="burgerMenuShowen = !burgerMenuShowen" class="ham hamRotate ham1" :class="burgerMenuShowen ? 'active' : ''" viewBox="0 0 100 100" width="60">
        <path
              class="line top"
              d="m 30,33 h 40 c 0,0 9.044436,-0.654587 9.044436,-8.508902 0,-7.854315 -8.024349,-11.958003 -14.89975,-10.85914 -6.875401,1.098863 -13.637059,4.171617 -13.637059,16.368042 v 40" />
        <path
              class="line middle"
              d="m 30,50 h 40" />
        <path
              class="line bottom"
              d="m 30,67 h 40 c 12.796276,0 15.357889,-11.717785 15.357889,-26.851538 0,-15.133752 -4.786586,-27.274118 -16.667516,-27.274118 -11.88093,0 -18.499247,6.994427 -18.435284,17.125656 l 0.252538,40" />
      </svg>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Sidebar",
    data() {
      return {
        links: [
          {name: 'Поиск товаров', systemName: 'blackbox'},
          {name: 'Отслеживание', systemName: 'tracking'},
          {name: 'Профиль', systemName: 'profile'},
        ],
        burgerMenuShowen: false
      }
    },
    methods: {
      isActive(name) {
        return this.$route.matched.find(item => item.name === name) !== undefined
      },
      linkTo(path) {
        this.$router.push({name: path})
        this.burgerMenuShowen = false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/scss/variables";

  .sidebar {
    background-color: $black;
    width: 5.71rem;
    position: fixed;
    z-index: 99;
    top: 0px;
    left: 0px;
    height: 100%;
    transition: all ease-in .2s;
    overflow: hidden;

    &:hover {
      width: 19.21rem;

      .sidebar-header__company-name {
        opacity: 1;
      }

      .sidebar-navigation-item__text {
        opacity: 1;
      }
    }
  }

  .sidebar-header {
    padding: 2.28em 2.14rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(223, 224, 235, .06);
  }

  .sidebar-header__company-name {
    margin-left: .78rem;
    color: $gray;
    opacity: .7;
    font-size: 1.42rem;
    font-weight: bold;
    letter-spacing: .4px;
    opacity: 0;
    transition: all ease-in .2s;
  }

  .sidebar-navigation {
    // padding-bottom: 1.42rem;
    border-bottom: 1px solid rgba(223, 224, 235, .06);
  }

  .sidebar-navigation-item {
    padding: 1.42rem 2.28rem 1.42rem 5.14rem;
    font-size: 1.14rem;
    letter-spacing: .2px;
    color: $gray;
    cursor: pointer;

    &:hover {
      background-color: #15171c !important;
    }

    &.sidebar-navigation-item_active {
      background-color: rgba(159, 162, 180, .08);
      color: $yellow;
      border-left: 3px solid $yellow;
    }

    &:nth-child(1) {
      background: url("../assets/img/ikons/nav-ikon_1.svg") no-repeat;
      background-position: 2.28rem center;

      &.sidebar-navigation-item_active {
        background: url("../assets/img/ikons/nav-ikon_1_active.svg") no-repeat, rgba(159, 162, 180, .08);
        background-position: calc(2.28rem - 3px) center;
      }
    }

    &:nth-child(2) {
      background: url("../assets/img/ikons/nav-ikon_4.svg") no-repeat;
      background-position: 2.28rem center;

      &.sidebar-navigation-item_active {
        background: url("../assets/img/ikons/nav-ikon_4_active.svg") no-repeat, rgba(159, 162, 180, .08);
        background-position: calc(2.28rem - 3px) center;
      }
    }

    &:nth-child(3) {
      background: url("../assets/img/ikons/nav-ikon_2.svg") no-repeat;
      background-position: 2.28rem center;

      &.sidebar-navigation-item_active {
        background: url("../assets/img/ikons/nav-ikon_2_active.svg") no-repeat, rgba(159, 162, 180, .08);
        background-position: calc(2.28rem - 3px) center;
      }
    }

    &:nth-child(4) {
      background: url("../assets/img/ikons/nav-ikon_3.svg") no-repeat;
      background-position: 2.28rem center;

      &.sidebar-navigation-item_active {
        background: url("../assets/img/ikons/nav-ikon_3_active.svg") no-repeat, rgba(159, 162, 180, .08);
        background-position: calc(2.28rem - 3px) center;
      }
    }
  }

  .sidebar-navigation-item__text {
    opacity: 0;
    transition: all ease-in .2s;
    white-space: nowrap;
  }

  .mobile-sidebar {
    display: none;
  }

  .ham {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform 400ms;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-left: 12px;
  }
  .hamRotate.active {
    transform: rotate(45deg);
  }
  .hamRotate180.active {
    transform: rotate(180deg);
  }
  .line {
    fill:none;
    transition: stroke-dasharray 400ms, stroke-dashoffset 400ms;
    stroke: #FFC700;
    stroke-width:5.5;
    stroke-linecap:round;
  }
  .ham1 .top {
    stroke-dasharray: 40 139;
  }
  .ham1 .bottom {
    stroke-dasharray: 40 180;
  }
  .ham1.active .top {
    stroke-dashoffset: -98px;
  }
  .ham1.active .bottom {
    stroke-dashoffset: -138px;
  }


  @media screen and (max-width: 568px) {
    .sidebar {
      display: none;
      &.active-sidebar {
        display: block;
        width: 100%;
        .sidebar-header__company-name {
          opacity: 1;
        }

        .sidebar-navigation-item__text {
          opacity: 1;
        }
        .sidebar-header {
          height: 60px;
          padding-top: 0px;
          padding-bottom: 0px;
          margin-top: 60px;
        }
      }
    }
    .mobile-sidebar {
      display: block;
      background-color: $black;
      height: 60px;
      width: 100%;
      position: fixed;
      z-index: 99;
      top: 0px;
      left: 0px;
      display: flex;
      align-items: center;
    }
  }
</style>