<template>
  <div class="contacts">
    <div class="current-user">
      <img class="user-avatar" :src="imageData(currentUser.login)">
      <div class="current-user-text">
        {{ currentUser.name }}
      </div>
    </div>
    <hr color="#95a5a6">
    <div class="users">
      <div class="user" :style="getDivStyle(user)" v-on:click="openWindowChat(user)" v-for="user in users"
        :key="user.login">
        <img class="user-avatar" :src="imageData(user.login)">
        <div class="current-user-text">
          {{ user.name }}
        </div>
        <div class="unread-message" v-if="this.exsistsUnreadMessages.includes(user.login)"></div>
      </div>
    </div>
  </div>
</template>
  
<script>

export default {
  computed: {
    exsistsUnreadMessages() {
      return this.$store.getters["exsistsUnreadMessages"]
    },
    currentUser() {
      return this.$store.getters["currentUser"]
    },
    activeUser() {
      return this.$store.getters["activeUser"]
    },
    users() {
      return this.$store.getters["users"]
    },
    avatars() {
      return this.$store.getters["avatars"]
    },
    imageData() {
      return (login) => {
        console.log("imageData = " + login);
        const avatar = this.avatars.find((element) => element.login == login);
        if (avatar == null) {
          return 'unnamed.jpg'
        } else {
          return avatar.imageUrl
        }
      }
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
      this.$store.commit("DELETE_EXSISTS_UNREAD_MESSAGES", user.login)

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

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  clip-path: circle();
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

.unread-message {
  background-color: #006eff;
  width: 12px;
  height: 12px;
  clip-path: circle();
  margin-left: auto;
  margin-right: 10px;
}
</style>