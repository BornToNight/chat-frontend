<template>
  <div class="chat">
    <ContatsComponent :autalUser="this.autalUser" :users="this.users" />
    <ChatWindowComponent :stomp-client="this.stompClient" :autalUser="this.autalUser" :users="this.users" />
  </div>
</template>
  
<script>

import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import ContatsComponent from '@/components/ContatsComponent.vue'
import ChatWindowComponent from '@/components/ChatWindowComponent.vue'

export default {
  name: 'ChatPage',

  components: {
    ContatsComponent,
    ChatWindowComponent,
  },

  data: () => ({
    socket: null,
    stompClient: '',
    users: [],
    autalUser: {},

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
      this.autalUser = this.$store.getters["atualUser"]
      this.stompClient.connect(
        {
          userId: this.autalUser.login, // Carry client information
          token: token
        },
        function connectCallback() {
          console.log("connected")
          __this.stompClient.subscribe(
            '/user/' + __this.autalUser.login + '/queue/messages', // Subscribe address
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
.chat {
  width: 1200px;
  height: 900px;
  border: 1px black solid;

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  margin: auto;
}
</style>
  