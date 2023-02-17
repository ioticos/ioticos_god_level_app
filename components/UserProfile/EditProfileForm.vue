<template>
  <card>
    <h5 slot="header" class="title">Edit profile</h5>
    <form @submit.prevent="updateProfile">
      <div class="row">
        <div class="col-md-5">
          <base-input
            type="text"
            label="Company name"
            placeholder="Your Company"
            v-model="user.company"
          >
          </base-input>
        </div>
        <div class="col-md-3">
          <base-input
            type="text"
            label="User Name"
            placeholder="User name"
            v-model="user.username"
          >
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="email"
            label="Email"
            placeholder="example@mail.com"
            v-model="user.email"
          >
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <base-input
            type="number"
            label="Telegram ID"
            placeholder="Telegram ID"
            v-model="user.telegramId"
            @input="handleTelegramIdInput"
            max="9999999999"
          >
          </base-input>
        </div>
      </div>

     
      <base-button native-type="submit" type="primary" class="btn-fill">
        Update profile
      </base-button>
    </form>
  </card>
</template>
<script>
export default {
  data() {
    return {
      user: {
        company: null,
        username: null,
        email: null,
        firstName: null,
        lastName: null,
        telegramId: null
      }
    };
  },
  methods: {

    handleTelegramIdInput() {
      if (this.user.telegramId.length > 10) {
        this.user.telegramId = this.user.telegramId.slice(0, 10);
      }
    },
    // Envía una solicitud PUT al backend para modificar un documento en la colección "User"
    async updateProfile() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };
      const toSend = {
          email: this.user.email,
          telegramId: this.user.telegramId
      };

      console.log(toSend);

      try {
        const res = await this.$axios.put("/user", toSend, axiosHeaders);
        if (res.data.status == "success") {
          this.$notify({
            type: "success",
            icon: "tim-icons icon-alert-circle-exc",
            message: res.data.message
          });

          const auth = {
              token: this.$store.state.auth.token,
              userData: res.data.userData
            }

            //token to de store - token a la tienda
            this.$store.commit('setAuth', auth);

            //set auth object in localStorage - Grabamos el token en localStorage
            localStorage.setItem('auth', JSON.stringify(auth));
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: 'Error to update user'
        });
        console.log(error);
        return;
      }
    },
  }
};
</script>
<style></style>
