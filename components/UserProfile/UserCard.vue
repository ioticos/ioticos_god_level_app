<template>
  <card class="card-user">
    <p class="card-text"></p>
    <div class="author">
      <div class="block block-one"></div>
      <div class="block block-two"></div>
      <div class="block block-three"></div>
      <div class="block block-four"></div>
      <a href="javascript:void(0)">
        <img class="avatar" src="img/emilyz.jpg" alt="Porfile photo" />
        <h5 class="title">{{ this.$store.state.auth.userData.name }}</h5>
      </a>
      <p class="description">{{this.$store.state.auth.userData.company}}</p>
      <p>
        {{ this.$store.state.auth.userData.email }}
      </p>
    </div>
  </card>
</template>
<script>
export default {};
</script>
<style></style>
