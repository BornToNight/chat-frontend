<template>
  <div class="login">

    <v-form>

      <v-text-field v-model="login" label="Login" outlined></v-text-field>

      <v-text-field v-model="password" type="password" label="Password" outlined></v-text-field>

      <v-btn class="btn-login"  color="blue" elevation="7" @click="onSubmit"> Login</v-btn>

    </v-form>

  </div>
</template>

<script>

export default {
  name: 'LoginPage',

  components: {
  },

  data: () => ({
    login: "",
    password: ""
  }),

  methods: {

    async onSubmit() {
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
            this.$router.push("/chat")
          }

        })
        .catch(error => {
          console.error('Error:', error);
        });
        // Подписаться на сокет
    }
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
