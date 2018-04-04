import store from '@/store';
export default {
  methods: {
    // sendCodeBtnDisable (noauto) {
    //   console.log('111111123');
    //   const now = Date.now();
    //   const localStorage = window.localStorage;
    //   let firstTime = Number(localStorage.getItem('sendCodeBtnTime'));
    //   firstTime = isNaN(firstTime) ? now : Number(firstTime);
    //   let startSecond;
    //   if (firstTime && now - firstTime <= 60000) { // 60 s
    //     startSecond = (now - firstTime) / 1000;
    //     startSecond = startSecond.toFixed();
    //   } else if (!noauto) {
    //     startSecond = 60;
    //     localStorage.setItem('sendCodeBtnTime', now);
    //   }
    //   if (startSecond <= 0 || !startSecond) return;
    //   this.sendCodeDisable = true;
    //   let labelInterval = setInterval(() => {
    //     this.sendCodeDisableLabel = `(${startSecond})`;
    //     if (startSecond <= 0) {
    //       clearInterval(labelInterval);
    //       labelInterval = null;
    //       this.sendCodeDisable = false;
    //       this.sendCodeDisableLabel = '';
    //       localStorage.setItem('sendCodeBtnTime', null);
    //       return;
    //     } else {
    //       startSecond--;
    //     }
    //   }, 1000);
    // },
    sendPhoneVfyCode (formName, cellphone) {
      const form = this.$refs[formName];
      // console.log('signData:', this.signData);
      form.validateField('cellphone', (valid) => {
        if (!valid) {
          store.dispatch('phoneCodeSend', { cellphone: cellphone })
          .then(() => {
            this.sendCodeBtnDisable();
            this.$message({
              message: '短信验证码已发送，请查收！',
              type: 'success',
            });
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
