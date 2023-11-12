<template>
  <div class="login">

    <v-form v-model="form" @submit.prevent="onSubmit">

      <v-text-field v-model="login" :readonly="loading" :rules="[required]" class="mb-2" label="Login"></v-text-field>

      <v-text-field type="password" v-model="password" :readonly="loading" :rules="[required]" label="Password"
        placeholder="Password"></v-text-field>

      <v-btn class="btn-login" :disabled="!form" :loading="loading" type="submit" color="blue" elevation="7">
        Login</v-btn>

    </v-form>

  </div>
</template>

<script>

export default {
  name: 'LoginPage',

  components: {
  },

  data: () => ({
    form: false,
    login: "",
    password: "",
    loading: false,
  }),

  methods: {

    async onSubmit() {
      this.loading = true
      const data = {
        login: this.login,
        password: this.password
      };

      await fetch('http://localhost:3700/api/auth/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          if (data?.result?.token) {
            this.$store.commit("SET_ACCESS_TOKEN", data.result.token)
            this.$store.commit("SET_CURRENT_USER", { login: this.login, name: data.result.userName })
            this.$router.push("/chat")
          }

        })
        .catch(error => {
          console.error('Error:', error);
        })
      this.loading = false
      // Подписаться на сокет
    },

    required(v) {
      return !!v || 'Field is required'
    },
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  margin: 100px auto;
  width: 400px;
}

.btn-login {
  float: right;
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
