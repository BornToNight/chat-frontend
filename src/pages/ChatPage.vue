<template>
  <div class="chat">
    <div class="user-div" v-for="user in this.users" :key="user.id">{{ user.name }}</div>
    <div class="user-chat-div" v-for="user in this.users" :key="user.id">Чат</div>
  </div>
</template>
  
<script>

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export default {
  name: 'ChatPage',

  components: {
  },

  data: () => ({
    socket: null,
    stompClient: '',
    users: [],

  }),

  mounted() {
    this.getAllUsers()
    this.connect()
  },

  beforeUnmount: function () {
    this.disconnect()
  },

  methods: {

    connect() {
      this.socket = new SockJS('http://localhost:4800/ws') // protocol field
      this.stompClient = Stomp.over(this.socket)
      let __this = this

      // Initiate a WebSocket connection to the server
      let token = this.$store.getters["accessToken"]
      let login = this.$store.getters["login"]
      this.stompClient.connect(
        {
          userId: login, // Carry client information
          token: token
        },
        function connectCallback() {
          console.log("connected")
          __this.stompClient.subscribe(
            '/user/' + login + '/queue/messages', // Subscribe address
            (response) => {
              console.log('connection succeeded', response) // Receive Response data
            }
          )
        },
        function errorCallBack(error) {
          console.log('Connection failed:' + error)
        }
      )
    },

    async getAllUsers() {

      await fetch('http://localhost:3700/api/auth/user', {
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters["accessToken"]
        }
      }
      )
        .then(response => response.json())
        .then(data => {
          if (data?.result) {
            this.users = data?.result
          }

        })
        .catch(error => {
          console.error('Error:', error);
        });
    },

    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect()
      }
    },

  }
}

</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.user-div {
  border: 1px solid black;
  width: 100px;
  height: 50px;
  padding: 5px;
}
</style>
  