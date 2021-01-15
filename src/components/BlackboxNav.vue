<template>
  <ul class="blackbox-navlist">
    <li class="blackbox-navlist__item"
        @click="navigateTo(item)"
        v-for="(item, idx) in list"
        :key="idx"
        :class="{'blackbox-navlist__item_active':  item.isActive}">
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
        this.$emit('navigate-group', item.systemName)
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "../assets/scss/variables";

  .blackbox-navlist {
    display: flex;
    flex: 1;
  }

  .blackbox-navlist__item {
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

    &.blackbox-navlist__item_active {
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

  .blackbox-navlist-trigger {
    width: 3px;
    height: 12px;
    background: url("../assets/img/ikons/navlist-action.svg") no-repeat right;
    padding-left: .85rem;
    cursor: pointer;
  }

  .blackbox-navlist-actions {
    position: absolute;
    background: white;
    z-index: 3;
    width: 6.35rem;
    top: 30px;
    right: -50%;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
    border: 1px solid $drayDevider;
  }

  .blackbox-navlist-actions__item {
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

    &.blackbox-navlist-actions__item_delete {

      span {
        color: $red;
      }
    }
  }
</style>