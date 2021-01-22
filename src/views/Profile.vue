<template>
  <Fragment>
    <UserData/>
    <!-- <TariffList/> -->
    <router-view :key="$route.fullPath"/>
  </Fragment>
</template>

<script>
  import UserData from "@/components/UserData";
  import {Fragment} from 'vue-fragment';

  export default {
    name: "Profile",
    components: {UserData, Fragment}
  }
</script>

<style scoped lang="scss">

</style>