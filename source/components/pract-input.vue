<template>
  <div>
    <span v-show="!edit" v-if="withText"
      @click="togEdit">
      <span>{{value}}</span>
      <i :class="selftextIcon || 'el-icon-edit'"></i>
    </span>
    <template v-if="nativeType === 'password'">
      <el-input
        ref="input"
        v-bind="$props"
        @input="v => $emit('input', v)"
        @change="v => $emit('change', v)"
        @focus="v => $emit('focus', v)"
        :type="type"
        v-show="edit"
        @blur="togEdit">
        <i class="el-icon-view" slot="suffix" :style="iconStyle" @mouseenter="togPass" @mouseleave="togPass"></i>
        <slot></slot>
      </el-input>
    </template>
    <template v-else>
      <el-input
        ref="input"
        v-bind="$props"
        @input="v => $emit('input', v)"
        @change="v => $emit('change', v)"
        @focus="v => $emit('focus', v)"
        :type="type"
        v-show="edit"
        @blur="togEdit">
        <slot></slot>
      </el-input>
    </template>
  </div>
</template>

<script>
export default {
  name: 'cp-pract-input',
  data () {
    return {
      type: this.nativeType,
      edit: false,
      selftextIcon: this.textIcon,
      selfwithText: this.withText,
      selfpasswordCanToggle: this.passwordCanToggle,
      iconStyle: {
        'font-size': '14px',
        'line-height': '40px',
      },
    };
  },
  mounted () {
    if (this.$attrs.type) this.type = this.$attrs.type;
    if (!this.selfwithText) this.edit = true;
    this.iconStyleCalc();
  },
  methods: {
    iconStyleCalc () {
      let size = this.size;
      const inputHeight = this.$refs.input.$el.clientHeight;
      if (!size) {
        if (inputHeight >= 40) {
          size = 'large';
        } else if (inputHeight < 40 && inputHeight >= 36) {
          size = 'medium';
        } else if (inputHeight < 36 && inputHeight >= 32) {
          size = 'small';
        } else if (inputHeight < 32 && inputHeight >= 28) {
          size = 'mini';
        } else {
          size = 'large';
        }
      }
      const fsK = 'font-size';
      const lhK = 'line-height';
      const sizeObj = {
        [fsK]: {
          large: '14px',
          medium: '14px',
          small: '13px',
          mini: '12px',
        },
        [lhK]: {
          large: '40px',
          medium: '36px',
          small: '32px',
          mini: '28px',
        },
      };
      this.iconStyle[fsK] = sizeObj[fsK][size];
      this.iconStyle[lhK] = sizeObj[lhK][size];
    },
    togEdit (e) {
      if (!this.selfwithText) return;
      if (this.edit) {
        this.edit = false;
      } else {
        this.edit = true;
        setTimeout(_ => this.$refs.input.$el.querySelector('input').focus(), 5);
      }
      this.$emit('blur', e, this.value);
    },
    togPass () {
      if (this.selfpasswordCanToggle) {
        if (this.type === 'password') {
          this.type = 'text';
        } else {
          this.type = 'password';
        }
      }
    },
  },
  props: {
    value: [ String, Number ],
    placeholder: String,
    size: String,
    resize: String,
    name: String,
    form: String,
    id: String,
    maxlength: Number,
    minlength: Number,
    readonly: Boolean,
    autofocus: Boolean,
    disabled: Boolean,
    nativeType: {
      type: String,
      default: 'text',
    },
    autosize: {
      type: [ Boolean, Object ],
      default: false,
    },
    rows: {
      type: Number,
      default: 2,
    },
    autoComplete: {
      type: String,
      default: 'off',
    },
    max: {},
    min: {},
    step: {},
    validateEvent: {
      type: Boolean,
      default: true,
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false,
    },
    textIcon: String,
    passwordCanToggle: {
      type: Boolean,
      default: false,
    },
    withText: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="stylus">
</style>
