<template>
  <div class="chat">
    <ContatsComponent :users="this.users" />
    <ChatWindowComponent :stomp-client="this.stompClient" />
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
    currentUser: {},

  }),

  mounted() {
    this.connect()
  },

  beforeUnmount: function () {
    this.disconnect()
  },

  methods: {

    connect() {
      this.socket = new SockJS('http://localhost:4800/ws') // protocol field
      this.stompClient = Stomp.over(this.socket)

      // Initiate a WebSocket connection to the server
      // let token = this.$store.getters["accessToken"]
      this.currentUser = this.$store.getters["currentUser"]

      this.stompClient.connect(
        {
          userId: this.currentUser.login, // Carry client information
          // token: token
        },
        function connectCallback() {
          this.stompClient.subscribe(
            '/user/' + this.currentUser.login + '/queue/messages', // Subscribe address
            (response) => {
              console.log('connection succeeded', response) // Receive Response data

              const notification = JSON.parse(response.body);

              const activeUser = this.$store.getters["activeUser"]

              if (activeUser.login === notification.senderId) {

                fetch('http://localhost:4800/messages/' + notification.id, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                })
                  .then(response => response.json())
                  .then(data => {
                    if (data) {
                      this.$store.commit("ADD_MESSAGE", data)
                    }

                  })
                  .catch(error => {
                    console.error('Error:', error);
                  })

              } else {
                if (!this.$store.getters["exsistsUnreadMessages"].includes(notification.senderId)) {
                  this.$store.commit("ADD_EXSISTS_UNREAD_MESSAGES", notification.senderId)
                }
                console.log("Received a new message from " + notification.senderId);
              }
            }
          )
        }.bind(this),
        function errorCallBack(error) {
          console.log('Connection failed:' + error)
        }
      )
    },

    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect()
      }
    },

  },
}

</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chat {
  width: 1200px;
  height: 900px;
  margin: auto;
  margin-top: 20px;

  display: flex;
}
</style>
  