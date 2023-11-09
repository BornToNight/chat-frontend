<template>
  <div class="contacts">
    <div class="user-div" v-on:click="openWindowChat(user)" v-for="user in users" :key="user.id">{{ user.name }}</div>
  </div>
</template>
  
<script>

export default {
  props: {
    users: {
      type: Array,
      required: true,
    },
    login: {
      type: String,
      required: true,
    },
  },
  methods: {
    openWindowChat: async function (user) {
      console.log(this.login)
      console.log(user)
      await fetch('http://localhost:4800/messages/' + this.login + '/' + user.login, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            console.log(data)
          }

        })
        .catch(error => {
          console.error('Error:', error);
        })
    }
  }
}

</script>

<style>
.contacts {
  background-color: slategrey;
  float: left;
  width: 10%;
  height: 100%;
}

.user-div {
  border: 1px solid black;
  padding: 5px;
}
</style>