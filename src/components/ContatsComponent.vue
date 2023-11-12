<template>
  <div class="contacts">
    <div class="current-user">
      <v-avatar class="current-user-avatar" color="white" :image="imageData(currentUser.login)" size="40"></v-avatar>
      <img :src="imageData(currentUser.login)" alt="Изображение">
      <div class="current-user-text">
        {{ currentUser.name }}
      </div>
    </div>
    <hr color="#95a5a6">
    <div class="users">
      <div class="user" :style="getDivStyle(user)" v-on:click="openWindowChat(user)" v-for="user in users"
        :key="user.login">
        <v-avatar class="current-user-avatar" color="white" image="smirk.png" size="40"></v-avatar>
        <div class="current-user-text">
          {{ user.name }}
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>

export default {
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  computed: {
    currentUser() {
      return this.$store.getters["currentUser"]
    },
    activeUser() {
      return this.$store.getters["activeUser"]
    },
    imageData() {
      return (login) => {
        console.log(localStorage.getItem(login));
        return localStorage.getItem(login);
      };
    },
  },
  methods: {
    getDivStyle(user) {

      return {
        backgroundColor: this.activeUser.login === user.login ? "#3c5b80" : "#32465a",
        cursor: 'pointer'
      };
    },
    openWindowChat: async function (user) {
      await fetch('http://localhost:4800/messages/' + this.currentUser.login + '/' + user.login, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.$store.commit("SET_MESSAGES", data)
          }

        })
        .catch(error => {
          console.error('Error:', error);
        })
      this.$store.commit("SET_ACTIVE_USER", user)
    }
  }
}

</script>

<style>
.contacts {
  background-color: #32465a;
  color: white;
  border-radius: 10px 0px 0px 10px;
  width: 20%;
  height: 100%;
}

.current-user {
  display: flex;
  align-items: center;
  height: 8%;
}

.current-user-avatar {
  margin-left: 10px;
}

.current-user-text {
  text-align: center;
  margin-left: 10px;
}

.users {
  overflow-y: scroll;
  height: 92%;
}

.users::-webkit-scrollbar {
  display: none;

}

.users::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: 20px;
  border: 3px solid #f5f5f5;
  ;
}

.user {
  display: flex;
  align-items: center;
  height: 50px;
}

.user:hover {
  background-color: #202d3a;
  cursor: pointer;
}

.user:active {
  background-color: #3c5b80;
}
</style>