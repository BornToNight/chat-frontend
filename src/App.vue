<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {

  },

  created() {
    if (this.$store.getters["accessToken"]) {
      this.$router.push("/chat")
    } else {
      this.$router.push("/login")
    }
  }
}
</script>