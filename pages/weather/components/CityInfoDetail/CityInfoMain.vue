<template>
    <div class="ww-city-info-props">
      <template v-for="(item, index) in info" >
        <div
          class="ww-city-info-props__item"
          :key="index">
          <div class="ww-city-info-props__item-icon">
            <AppIcon :name="item.icon" />
          </div>
          <div class="ww-city-info-props__item-value">
            {{ item.value }}
          </div>
        </div>
      </template>
    </div>
  </template>

<script>
import AppIcon from '../app/AppIcon.vue'

export default {
  components: {
    AppIcon
  },
  props: {
    info: {
      type: Array,
      required: true
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
.city-info-props {
  align-items: center;
  background-color: $color-white;
  border-radius: 1.25rem;
  box-shadow: 0 0.25rem 1rem -0.35rem rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: -1rem;
  padding: 0.75rem 0;
  width: 100%;
  z-index: 1;

  .item {
    align-items: center;
    display: inline-flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    width: auto;
  }

  .item-icon {
    align-items: center;
    color: $color-primary;
    display: inline-flex;
    justify-content: center;
    margin-bottom: 0.25rem;
    width: auto;

    & > * {
      width: 1.25rem !important;
    }
  }

 .item-value {
    font-size: 0.75rem;
    font-weight: 600;
    text-align: center;
  }
}
</style>
