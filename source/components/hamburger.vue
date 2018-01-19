<template>
  <button class="cp-hamburger" :class="active ? 'active' : ''" @click="active = !active; $emit('active', active)">
    <span></span>
  </button>
</template>

<script>
export default {
  name: 'cp-hamburger',
  data () {
    return {
      active: false,
    };
  },
  methods: {
  },
};
</script>

<style lang="stylus">
.cp-hamburger
  font-size 20px
  display inline-block
  width 1em
  height 1em
  padding 0
  cursor pointer
  transition transform .2s ease-in-out
  vertical-align middle
  border 0 none
  background transparent
  &:before, &:after
    content: "";
  &:before, span, &:after
    display block
    width 100%
    height .2em
    margin 0 0 .1em
    transition transform .2s ease-in-out
    border-radius .05em
    background #545C64
.cp-hamburger.active
  transform rotate(270deg)

</style>
