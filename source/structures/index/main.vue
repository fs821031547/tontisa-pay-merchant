<template>
  <div class="struct-index-main">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'struct-index-main',
  data () {
    return {

    };
  },
};
</script>

<style lang="stylus">
.struct-index-main
  .in-main-margin
    margin 20px
</style>
