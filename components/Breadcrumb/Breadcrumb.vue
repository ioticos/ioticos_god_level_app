<template>
  <ul class="breadcrumb" :class="{ 'bg-transparent': transparent }">
    <slot></slot>
  </ul>
</template>
<script>
export default {
  name: 'breadcrumb',
  props: {
    transparent: {
      type: Boolean,
      default: true
    }
  }
};
</script>
<style></style>
