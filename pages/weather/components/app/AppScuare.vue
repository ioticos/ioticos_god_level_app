<template>
    <div
      class="ww-app-icon-square">
      <AppIcon v-bind="$attrs" />
    </div>
  </template>

<script>
// Este componente muestra un icono cuadrado utilizando AppIcon

// Importa el componente AppIcon
import AppIcon from './AppIcon.vue'

// Declara la clase AppIconSquare
export default {
  // Registra AppIcon como un componente hijo
  components: {
    AppIcon
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
.app-icon-square {
  align-items: center;
  background-color: $color-white;
  border-radius: 0.5rem;
  display: inline-flex;
  justify-content: center;
  line-height: 1;
  padding: 0.5rem;
  user-select: none;
  white-space: nowrap;
  width: auto;
}
</style>