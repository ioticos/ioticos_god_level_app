<template>
    <div class="row">
      <div class="col-md-8"><edit-profile-form> </edit-profile-form></div>
      <div class="col-md-4"><user-card> </user-card></div>
    </div>
  </template>
  <script>
  import EditProfileForm from '../components/UserProfile/EditProfileForm.vue';
  import UserCard from '../components/UserProfile/UserCard.vue';
  
  export default {
    middleware: "authenticated",
    name: 'user',
    components: {
      EditProfileForm,
      UserCard
    }
  };
  </script>
  <style></style>
  