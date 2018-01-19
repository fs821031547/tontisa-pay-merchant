<template>
  <el-card class="struct-user-info in-main-margin">
    <div slot="header" class="clearfix">
      <span>基本信息</span>
      <el-button
        @click="passOper.visible = true"
        style="float: right; padding: 3px 0" type="text">
        修改密码
      </el-button>
    </div>
    <el-form label-width="80px" size="mini" style="width: 380px;">
      <el-form-item label="头像" class="avatar-block">
        <el-upload :action="uploadData.action"
          :on-change="fileChange"
          :on-success="uploadSuccess"
          :on-error="uploadFail"
          :data="uploadData.mount"
          :accept="uploadData.accept.join(',')"
          :on-progress="uploadProgress"
          :show-file-list="false"
          :multiple="false"
          :disabled="uploadData.disabled"
          :limit="1"
          :name="uploadData.name"
          :before-upload="beforeUpload">
          <el-progress type="circle"
            :percentage="uploadData.progress"
            v-show="uploadData.disabled"
            class="avatar-progress"></el-progress>
          <cp-avatar size="large" :src="userInfo.headImg"></cp-avatar>
          <i class="el-icon-edit" style="float: right; line-height: 40px; margin-left: 8px;"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户昵称">
        <cp-pract-input :maxlength="24" v-model="userInfo.nickname" @change="modifyNickname"></cp-pract-input>
      </el-form-item>
      <el-form-item label="手机号">
        <span>{{userInfo.cellphone}}</span>
      </el-form-item>
      <el-form-item label="邮箱">
        <span style="display: inline-block;" @click="openBindEmail">
          <span>{{userInfo.email || '无'}}</span>
          <i class="el-icon-edit" v-show="userInfo.emailIsVerified === 0"></i>
        </span>
        <span style="display: inline-block; font-size: 12px; color: #afafaf">绑定邮箱可以作为登录账号使用</span>
      </el-form-item>
    </el-form>

    <cp-plain-modal
      :visible="emailOper.visible"
      @click="emailOper.visible = false"
      contentWidth="400px"
      class="email-oper">
      <el-card>
        <div slot="header">
          <span>绑定邮箱</span>
        </div>
        <div>
          <el-form label-width="80px"
            size="mini"
            ref="emailForm"
            :model="emailData"
            :rules="rules"
            style="width: 320px;">
            <el-form-item label="邮箱号" prop="email">
              <el-input v-model="emailData.email">
                <template slot="append">
                  <el-button @click="sendEmailVfyCode('emailForm', emailData.email)">验证邮箱</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="emailVfyCode">
              <el-input v-model="emailData.emailVfyCode"></el-input>
            </el-form-item>
          </el-form>
          <div style="padding-left: 80px;">
            <el-button type="primary" @click="bindEmail">确认绑定</el-button>
            <el-button @click="emailOper.visible = false">不绑定了</el-button>
          </div>
        </div>
      </el-card>
    </cp-plain-modal>

    <cp-plain-modal
      :visible="passOper.visible"
      @click="passOper.visible = false"
      contentWidth="400px"
      class="pass-oper">
      <el-card>
        <div slot="header">
          <span>修改密码</span>
          <el-button
            style="float: right; padding: 3px 0"
            @click="togPassMode"
            type="text">
            {{passOper.modeTexts[passOper.mode]}}
          </el-button>
        </div>
        <div>
          <el-form label-width="80px"
            size="mini"
            style="width: 320px;"
            ref="passForm"
            :model="passData"
            :rules="rules">
            <el-form-item label="旧密码" v-if="passOper.mode === 0" prop="passwordOld">
              <cp-pract-input
                v-model="passData.passwordOld"
                native-type="password"
                size="mini"
                password-can-toggle :with-text="false">
              </cp-pract-input>
            </el-form-item>
            <el-form-item label="验证码" v-else prop="phoneVfyCode">
              <el-tooltip
                :content="'验证短信将发送到您绑定的手机' + userInfo.cellphone + '，注意查收'"
                placement="top" effect="light">
                <el-input v-model="passData.phoneVfyCode">
                  <template slot="append">
                    <el-button type="primary" @click="sendPhoneVfyCode('passForm', userInfo.cellphone)">获取验证码</el-button>
                  </template>
                </el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
              <cp-pract-input
                v-model="passData.password"
                native-type="password"
                size="mini"
                password-can-toggle :with-text="false">
              </cp-pract-input>
            </el-form-item>
          </el-form>
          <div style="padding-left: 80px;">
            <el-button type="primary" @click="modifyPass">确认修改</el-button>
            <el-button @click="passOper.visible = false">取消修改</el-button>
          </div>
        </div>
      </el-card>
    </cp-plain-modal>
  </el-card>
</template>

<script>
export default {
  name: 'struct-user-info',
  data () {
    const user = this.$store.state.user.user || {};
    return {
      oldUserInfo: {
        nickname: user.nickname,
      },
      passOper: {
        mode: 0,
        modeTexts: [ '忘记密码', '返回' ],
        visible: false,
      },
      passData: {
        password: '',
        passwordOld: '',
        phoneVfyCode: '',
        vfyType: 0,
      },
      rules: this.$store.state.user.userRules,
      emailOper: {
        visible: false,
      },
      emailData: {
        email: '',
        emailVfyCode: '',
      },
      uploadData: {
        accept: [ '.jpg', '.png', '.jpeg' ],
        fileSize: 1024 * 500, // 以 byte 为单位
        name: 'file',
        action: 'https://upload.qbox.me/',
        domain: '',
        disabled: false,
        canUpload: false,
        progress: 0,
        mount: {
          key: '',
          token: '',
        },
      },
    };
  },
  methods: {
    fileChange (file) {
      this.uploadData.canUpload = false;
      // 判断文件后缀和文件大小
      const fileType = file.name.substring(file.name.lastIndexOf('.')); // 获取文件扩展名
      if (this.uploadData.accept.indexOf(fileType) < 0) {
        return;
      }
      if (file.size > this.uploadData.fileSize) {
        this.$message({
          message: '上传头像大小不能超过' + (this.uploadData.fileSize / 1024) + 'kb，请重新选择！',
          type: 'warning',
        });
        return;
      }
      this.userInfo.headImg = file.url;
      const date = new Date();
      const key = 'pay-merchant/headimg/' + date.getFullYear() + '/' + (date.getMonth() + 1) + '/' +
      date.getDate() + '/' + file.uid + fileType;
      this.uploadData.canUpload = true;
      this.uploadData.mount.key = key;
    },
    beforeUpload (file) {
      if (!this.uploadData.canUpload) {
        return false;
      } else {
        // 获取七牛上传token
        return this.$store.dispatch('uploadToken')
        .then((res) => {
          console.log('data', res);
          this.uploadData.domain = res.dn;
          this.uploadData.mount.token = res.token;
          this.uploadData.disabled = true;
          return true;
        });
      }
    },
    uploadSuccess (response, file, fileList) {
      this.uploadData.disabled = false;
      // 更新用户头像
      const fileUrl = this.uploadData.domain + '/' + response.key;
      console.log('上传成功', fileUrl);
      this.$store.dispatch('userInfoModify', { headImg: fileUrl });
    },
    uploadFail (err, file, fileList) {
      console.log('uploadFail', err);
      this.uploadData.disabled = false;
    },
    uploadProgress (event, file, fileList) {
      this.uploadData.progress = file.percentage;
    },
    openBindEmail () {
      if (this.userInfo.emailIsVerified === 0) {
        this.emailOper.visible = true;
        this.emailData.email = this.userInfo.email;
      }
    },
    bindEmail () {
      const form = this.$refs.emailForm;
      form.validate((valid) => {
        if (valid) {
          this.$store.dispatch('userBindEmail', this.emailData).then(() => {
            this.emailOper.visible = false;
            this.$message({
              message: '绑定邮箱修改成功！',
              type: 'success',
            });
          });
        } else {
          console.log('error submit!!');
        }
      });
    },
    sendEmailVfyCode (formName, email) {
      const form = this.$refs[formName];
      form.validateField('email', (valid) => {
        if (!valid) {
          console.log('发送验证码', email);
          this.$store.dispatch('emailCodeSend', { email: this.emailData.email })
          .then(() => {
            this.$message({
              message: '邮箱验证码已发送，请查收！',
              type: 'success',
            });
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    modifyPass () {
      const form = this.$refs.passForm;
      form.validate((valid) => {
        if (valid) {
          this.passData.vfyType = this.passOper.mode;
          this.$store.dispatch('userInfoModify', this.passData).then(() => {
            this.passOper.visible = false;
            this.$message({
              message: '密码修改成功！',
              type: 'success',
            });
          });
        } else {
          console.log('error submit!!');
        }
      });
    },
    sendPhoneVfyCode (formName, cellphone) {
      const form = this.$refs[formName];
      form.validateField('cellphone', (valid) => {
        if (!valid) {
          console.log('发送验证码', cellphone);
          this.$store.dispatch('phoneCodeSend', { cellphone: this.passData.cellphone })
          .then(() => {
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
    modifyNickname (v) {
      // 修改用户的昵称
      if (!v) {
        this.userInfo.nickname = this.oldUserInfo.nickname;
      } else {
        // 调用修改接口
        this.$store.dispatch('userInfoModify', { nickname: this.userInfo.nickname })
        .then(() => {
          this.oldUserInfo.nickname = this.userInfo.nickname;
        });
      }
    },
    togPassMode () {
      this.passOper.mode = [ 1, 0 ][this.passOper.mode];
      // 清空form的验证信息
      const form = this.$refs.passForm;
      form.clearValidate();
    },
  },
  computed: {
    userInfo () {
      return this.$store.state.user.user || {};
    },
  },
  watch: {
    'passOper.visible' () {
      this.passData.passwordOld = '';
      this.passData.password = '';
    },
  },
};
</script>

<style lang="stylus">
.struct-user-info
  .avatar-block
    > label
      height 40px
      line-height 40px
    > div
      height 40px
    .avatar-progress
      position absolute
      z-index 1
      .el-progress-circle
        width 40px !important
        height 40px !important
      .el-progress__text
        font-size 12px !important
</style>
