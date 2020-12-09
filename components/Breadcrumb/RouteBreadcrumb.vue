<template>
  <bread-crumb>
    <BreadCrumbItem
      v-for="(route, index) in $route.matched.slice()"
      :key="route.name"
      style="display:inline-block"
    >
      <nuxt-link
        :to="{ name: route.name }"
        v-if="index < $route.matched.length - 1"
        class="breadcrumb-link"
      >
        {{ routeName }}
      </nuxt-link>
      <span v-else class="breadcrumb-current">{{ routeName }}</span>
    </BreadCrumbItem>
  </bread-crumb>
</template>

<script>
import BreadCrumb from './Breadcrumb';
import BreadCrumbItem from './BreadcrumbItem';

export default {
  name: 'route-breadcrumb',
  components: {
    BreadCrumb,
    BreadCrumbItem
  },
  computed: {
    routeName() {
      const { path } = this.$route;
      let parts = path.split('/')
      return parts.map(p => this.capitalizeFirstLetter(p)).join(' ');
    }
  },
  methods: {
    capitalizeFirstLetter(string) {
      if (!string || typeof string !== 'string') {
        return ''
      }
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
};
</script>

<style scoped></style>
