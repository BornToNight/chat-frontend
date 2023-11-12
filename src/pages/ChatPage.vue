<template>
  <div class="chat">
    <ContatsComponent :users="this.users" />
    <ChatWindowComponent :stomp-client="this.stompClient" :users="this.users" />
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
                console.log("Received a new message from " + notification.senderName);
              }
            }
          )
        }.bind(this),
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

            data?.result.forEach((user) => {
              if (user.avatar.fileName !== "") {
                fetch('http://localhost:3600/api/file/' + user.avatar.fileName, {
                  headers: {
                    'Authorization': 'Bearer ' + this.$store.getters["accessToken"]
                  },
                  responseType: 'blob',
                }
                )
                  .then(response => {
                    if (response.ok) {
                      const blob = new Blob([response.data]);
                      const imageUrl = URL.createObjectURL(blob);
                      console.log(user.login);
                      localStorage.setItem(user.login, imageUrl);
                    }
                  })

                  .catch(error => {
                    console.error('Error:', error);
                  });
              }
            })
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
  