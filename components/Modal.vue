<template>
  <SlideYUpTransition :duration="animationDuration">
    <div
      ref="modal"
      class="modal fade"
      @click.self="closeModal"
      :class="[
        { 'show d-block': show },
        { 'd-none': !show },
        { 'modal-mini': type === 'mini' }
      ]"
      v-show="show"
      tabindex="-1"
      role="dialog"
      :aria-hidden="!show"
    >
      <div
        class="modal-dialog"
        role="document"
        :class="[
          { 'modal-notice': type === 'notice' },
          { 'modal-dialog-centered': centered },
          modalClasses
        ]"
      >
        <div
          class="modal-content"
          :class="[
            gradient ? `bg-gradient-${gradient}` : '',
            modalContentClasses
          ]"
        >
          <div
            class="modal-header"
            :class="[headerClasses]"
            v-if="$slots.header"
          >
            <slot name="header"></slot>
            <slot name="close-button">
              <button
                type="button"
                class="close"
                v-if="showClose"
                @click="closeModal"
                data-dismiss="modal"
                aria-label="Close"
              >
                <i class="tim-icons icon-simple-remove"></i>
              </button>
            </slot>
          </div>

          <div v-if="$slots.default" class="modal-body" :class="bodyClasses">
            <slot></slot>
          </div>

          <div class="modal-footer" :class="footerClasses" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </SlideYUpTransition>
</template>
<script>
import { SlideYUpTransition } from 'vue2-transitions';

export default {
  name: 'modal',
  components: {
    SlideYUpTransition
  },
  props: {
    show: Boolean,
    showClose: {
      type: Boolean,
      default: true
    },
    centered: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true,
      description: 'Whether modal should be appended to document body'
    },
    scrollToBottom: {
      type: Boolean,
      default: true,
      description: "Whether modal should scroll to it's bottom automatically"
    },
    type: {
      type: String,
      default: '',
      validator(value) {
        let acceptedValues = ['', 'notice', 'mini'];
        return acceptedValues.indexOf(value) !== -1;
      },
      description: 'Modal type (notice|mini|"") '
    },
    modalClasses: {
      type: [Object, String],
      description: 'Modal dialog css classes'
    },
    modalContentClasses: {
      type: [Object, String],
      description: 'Modal dialog content css classes'
    },
    gradient: {
      type: String,
      description: 'Modal gradient type (danger, primary etc)'
    },
    headerClasses: {
      type: [Object, String],
      description: 'Modal Header css classes'
    },
    bodyClasses: {
      type: [Object, String],
      description: 'Modal Body css classes'
    },
    footerClasses: {
      type: [Object, String],
      description: 'Modal Footer css classes'
    },
    animationDuration: {
      type: Number,
      default: 500,
      description: 'Modal transition duration'
    }
  },
  methods: {
    closeModal() {
      this.$emit('update:show', false);
      this.$emit('close');
    },
    scrollModalToBottom() {
      if (!this.scrollToBottom) return;
      let elm = this.$refs.modal;
      elm.scrollTop = elm.scrollHeight - elm.clientHeight;
    }
  },
  mounted() {
    if (this.appendToBody) {
      document.body.appendChild(this.$el);
    }
  },
  destroyed() {
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  },
  watch: {
    show(val) {
      let documentClasses = document.body.classList;
      if (val) {
        documentClasses.add('modal-open');
        this.$nextTick(this.scrollModalToBottom);
      } else {
        documentClasses.remove('modal-open');
      }
    }
  }
};
</script>
<style>
.modal.show {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
