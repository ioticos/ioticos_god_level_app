<template>
  <component :is="tag" class="badge" :class="`badge-${type}`">
    <slot></slot>
  </component>
</template>
<script>
export default {
  name: 'badge',
  props: {
    tag: {
      type: String,
      default: 'span',
      description: 'Badge tag'
    },
    type: {
      type: String,
      default: 'default',
      validator: value => {
        let acceptedValues = [
          'primary',
          'info',
          'success',
          'warning',
          'danger',
          'default'
        ];
        return acceptedValues.indexOf(value) !== -1;
      },
      description: 'Badge type (primary|info|success|warning|danger|default)'
    }
  }
};
</script>
<style></style>
