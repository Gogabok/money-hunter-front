<template>
  <div class="tracking block_container">
    <div class="tracking-navigation">
      <div class="tracking-navigation-wrapper">
        <TrackingNav
          :list="trackingNavList"
        />
      </div>
      <Btn clazz="tracking-add-category" @click="handleCreateGroupBtn"/>
    </div>

    <router-view :key="$route.fullPath"/>
  </div>
</template>

<script>
  import TrackingNav from "@/components/TrackingNav";
  import Btn from "@/shared-components/Btn";
  import {SHOW_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import CreateGroup from "@/components/tracking/CreateGroup";
  import {GROUP_NAMES_GETTER} from "@/store/modules/tracking/constants";
  import {mapGetters} from "vuex";

  export default {
    name: "Tracking",
    components: {TrackingNav, Btn},
    computed: {
      ...mapGetters('tracking', [GROUP_NAMES_GETTER]),
      trackingNavList() {
        return [
          {label: "Список групп", system: true},
          ...this[GROUP_NAMES_GETTER].map(name => ({label: name, actions: true}))
        ]
      }
    },
    methods: {
      handleCreateGroupBtn() {
        this.$store.commit(`modal/${SHOW_MODAL_MUTATION}`, {component: CreateGroup});
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "../assets/scss/variables";

  .tracking {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 1.92rem;
  }

  .tracking-navigation {
    display: flex;
  }

  .tracking-navigation-wrapper {
    overflow: auto hidden;
    display: flex;
    flex-direction: column;
    &::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 7px;
      height: 7px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: rgba(0,0,0,.5);
      -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
    }
  }

  .tracking-add-category {
    flex: 0 0 2.75rem;
    height: 2.75rem;
    background: url("../assets/img/ikons/plus2.svg") no-repeat center, $yellow;
    border-radius: 4px 4px 0 0;
    margin-left: 5px;
  }
  @media screen and (max-width: 710px) {
    .tracking {
      padding: 10px;
    }
  }
</style>