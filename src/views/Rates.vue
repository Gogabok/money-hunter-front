<template>
  <Fragment>
    <TariffList/>
  </Fragment>
</template>

<script>
  import TariffList from "@/components/TariffList";
  import {Fragment} from 'vue-fragment';

  export default {
    name: "Rates",
    components: {TariffList, Fragment}
  }
</script>

<style scoped lang="scss">

</style>