<template>
  <transition name="cp-backtop-fade">
    <div v-show="backtopShow" class="cp-backtop" @click="backtop">
      <i class="el-icon-caret-top"></i>
    </div>
  </transition>
</template>

<script>
let backtopShowHandler;
export default {
  name: 'cp-backtop',
  data () {
    return {
      backtopShow: false,
    };
  },
  methods: {
    backtop () {
      if (window.scrollY > 0) {
        const scrollMove = setInterval(() => {
          if (window.scrollY > 0) {
            window.scrollTo(0, window.scrollY - 200);
          } else if (window.scrollY <= 0) {
            clearInterval(scrollMove);
          }
        }, 20);
      }
    },
  },
  mounted () {
    const vm = this;
    backtopShowHandler = function (e) {
      e.stopPropagation();
      const diffv = window.scrollY - document.body.clientHeight;
      if (diffv > -580 && !vm.backtopShow) {
        vm.backtopShow = true;
      } else if (diffv <= -580 && vm.backtopShow) {
        vm.backtopShow = false;
      }
    };
    window.addEventListener('scroll', backtopShowHandler, false);
  },
  destroyed () {
    window.removeEventListener('scroll', backtopShowHandler, false);
  },
};
</script>

<style lang="stylus">
.cp-backtop
  cursor pointer
  background-color: #fff;
  position: fixed;
  right: 100px;
  bottom: 150px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  transition: .3s;
  box-shadow: 0 0 6px rgba(0,0,0,.12);
  i
    color: #409eff;
    display: block;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
.cp-backtop-fade-enter-active,
.cp-backtop-fade-leave-active
  opacity 1
.cp-backtop-fade-enter,
.cp-backtop-fade-leave-to
  transform translateY(-30px)
  opacity 0
</style>
