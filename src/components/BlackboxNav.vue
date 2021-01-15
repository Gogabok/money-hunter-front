<template>
  <ul class="tracking-navlist">
    <li class="tracking-navlist__item"
        @click="navigateTo(item)"
        v-for="(item, idx) in list"
        :key="idx"
        :class="{'tracking-navlist__item_active':  isActive(item)}">
      <span>{{item.label}}</span>
    </li>
  </ul>
</template>

<script>

  export default {
    name: "BlackboxNav",
    props: {
      list: {
        type: Array,
        required: true
      },
    },
    methods: {
      isActive(item) {
        return false;
      },
      navigateTo(item) {
        return false;
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "../assets/scss/variables";

  .tracking-navlist {
    display: flex;
    flex: 1;
  }

  .tracking-navlist__item {
    cursor: pointer;
    flex: 1 0 auto;
    padding: 0.71rem 1.42rem;
    background: $drayDevider;
    border-radius: 4px 4px 0 0;
    border: 1px solid $drayDevider;
    border-bottom: none;
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /*position: relative;*/

    &.tracking-navlist__item_active {
      background: white;
      box-shadow: inset 0px 3px 0px $yellow;
    }

    &:last-child {
      margin-right: 0;
    }

    > span {
      text-transform: uppercase;
      font-size: .85rem;
      font-weight: 500;
      color: black;
    }
  }

  .tracking-navlist-trigger {
    width: 3px;
    height: 12px;
    background: url("../assets/img/ikons/navlist-action.svg") no-repeat right;
    padding-left: .85rem;
    cursor: pointer;
  }

  .tracking-navlist-actions {
    position: absolute;
    background: white;
    z-index: 3;
    width: 6.35rem;
    top: 30px;
    right: -50%;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
    border: 1px solid $drayDevider;
  }

  .tracking-navlist-actions__item {
    padding: 0 .64rem 2px;
    border-bottom: 1px solid $drayDevider;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:last-child {
      border-bottom: none;
    }

    span {
      font-size: .85rem;
    }

    &.tracking-navlist-actions__item_delete {

      span {
        color: $red;
      }
    }
  }
</style>