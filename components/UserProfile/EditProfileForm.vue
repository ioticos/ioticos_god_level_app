<template>
  <card>
    <h5 slot="header" class="title">Edit profile</h5>
    <form @submit.prevent="updateProfile">
      <div class="row">
        <div class="col-md-5">
          <base-input
            type="text"
            label="Company name"
            placeholder="Company name"
            v-model="user.company"
          >
          </base-input>
        </div>
        <div class="col-md-3">
          <base-input
            type="text"
            label="User Name"
            placeholder="User Name"
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
            label="Telegram id"
            placeholder="Telegram ID"
            v-model="user.telegramId"
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
        company: 'Ioticos',
        username: 'michael23',
        email: null,
        firstName: 'Xavier',
        lastName: '',
        telegramId: ''
      }
    };
  },
  methods: {
    updateProfile() {
      alert('Your data: ' + JSON.stringify(this.user));
    },
    // Envía una solicitud PUT al backend para modificar un documento en la colección "User"
    async updateTemplate() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };
      const toSend = {
          email: this.email,
          telegramId: this.telegramId
      };
      try {
        const res = await this.$axios.put("/user", toSend, axiosHeaders);
        if (res.data.status == "success") {
          this.$notify({
            type: "success",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Template update!"
          });
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error editing template..."
        });
        console.log(error);
        return;
      }
    },
  }
};
</script>
<style></style>
