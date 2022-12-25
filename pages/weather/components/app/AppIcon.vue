<template>
  <div
    :class="classes"
    :style="{
      width: size,
      height: 'auto'
    }"
    v-html="require(`@/assets/icons/${name}.svg`)" />
  </template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: '1rem'
    }
  },
  computed: {
    classes() {
      return [
        'ww-icon'
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
$font-size: 16px;
$font-family: 'Montserrat', sans-serif !important;

$color-primary: #6091e6;
$color-black: #232323;
$color-white: #fff;
$color-grey: #f6f6f8;
$color-bg-app: #f5f8fd;
$color-icon: #7b7b7b;
$color-placeholder: #c4c4d8;

$color-bg-active-list-item: #9abaf2;

$color-bg-info-detail-dark: #90b2ee;
$color-bg-info-detail-light: #b6cffb;
.icon {
  align-items: center;
  color: currentColor;
  display: inline-flex;
  justify-content: center;
  line-height: 1;
  user-select: none;
  white-space: nowrap;

  &::v-deep svg {
    color: inherit;
    fill: none;
    height: 100%;
    width: 100%;
  }
}
</style>