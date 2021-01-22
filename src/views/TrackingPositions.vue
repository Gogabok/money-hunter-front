<template>
  <div class="tracking block_container">
    <div class="tracking-navigation">
      <div class="tracking-navigation-wrapper">
        <TrackingPositionsNav
          :list="trackingNavList"
        />
      </div>
      <!-- <Btn clazz="tracking-add-category" @click="handleCreateGroupBtn"/> -->
    </div>

    <router-view :key="$route.fullPath"/>
  </div>
</template>

<script>
  import TrackingPositionsNav from "@/components/TrackingPositionsNav";
  // import Btn from "@/shared-components/Btn";
  import {SHOW_MODAL_MUTATION} from "@/store/modules/modal/constants";
  import CreateGroup from "@/components/tracking/CreateGroup";
  import {POSITION_GETTER} from "@/store/modules/trackingPositions/constants";
  import {mapGetters} from "vuex";

  export default {
    name: "TrackingPositions",
    components: {TrackingPositionsNav},
    computed: {
      ...mapGetters('trackingPositions', [POSITION_GETTER]),
      trackingNavList() {
        return [
          {label: "Список товаров", system: true},
          ...this[POSITION_GETTER].map(name => ({label: name.articul, actions: false}))
        ]
      }
    },
    methods: {
      // handleCreateGroupBtn() {
        // this.$store.commit(`modal/${SHOW_MODAL_MUTATION}`, {component: CreateGroup});
      // },
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
  }

  .tracking-add-category {
    flex: 0 0 2.75rem;
    height: 2.75rem;
    background: url("../assets/img/ikons/plus2.svg") no-repeat center, $yellow;
    border-radius: 4px 4px 0 0;
  }
  @media screen and (max-width: 710px) {
    .tracking {
      padding: 10px;
    }
  }
</style>