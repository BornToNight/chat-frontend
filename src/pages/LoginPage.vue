<template>
  <div class="login">

    <v-form v-model="form" @submit.prevent="onSubmit">

      <v-text-field v-model="login" :readonly="loading" :rules="[required]" class="mb-2" label="Логин"></v-text-field>

      <v-text-field type="password" v-model="password" :readonly="loading" :rules="[required]"
        label="Пароль"></v-text-field>

      <v-btn class="btn-login" :disabled="!form" :loading="loading" type="submit" color="blue" elevation="7">
        Login</v-btn>

    </v-form>

  </div>
</template>

<script>

export default {
  name: 'LoginPage',

  data: () => ({
    form: false,
    login: "",
    password: "",
    loading: false,
  }),

  methods: {

    onSubmit() {
      this.loading = true
      const data = {
        login: this.login,
        password: this.password
      };

      fetch('http://172.16.20.73/api/auth/generate', {
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
            this.getAllUsers()
          }

        })
        .catch(error => {
          console.error('Error:', error);
        })

      this.loading = false
    },


    getAllUsers() {

      fetch('http://172.16.20.73/api/auth/user', {
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters["accessToken"]
        }
      }
      )
        .then(response => response.json())
        .then(data => {
          if (data?.result) {

            data?.result.forEach((user) => {
              if (user.avatar.fileName !== "") {
                fetch('http://172.16.20.73/api/file/' + user.avatar.fileName, {
                  headers: {
                    'Authorization': 'Bearer ' + this.$store.getters["accessToken"]
                  },
                }
                )
                  .then(response => {
                    if (response.ok) {
                      return response.arrayBuffer();
                    } else {
                      throw new Error('Network response was not ok');
                    }
                  })
                  .then(buffer => {
                    const blob = new Blob([buffer], { type: 'image/jpeg' });
                    const imageUrl = URL.createObjectURL(blob);
                    this.$store.commit("ADD_AVATAR", { login: user.login, imageUrl: imageUrl })
                    localStorage.setItem(user.login, imageUrl);
                  })

                  .catch(error => {
                    console.error('Error:', error);
                  });
              }
            })
            this.$store.commit("SET_USERS", data?.result)
          }

        })
        .catch(error => {
          console.error('Error:', error);
        });
      this.$router.push("/chat")
    },

    required(v) {
      return !!v || 'Объязательное поле'
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
