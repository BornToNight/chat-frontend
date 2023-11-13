<template>
  <div class="chat-window">
    <div class="active-user">
      <img class="active-user-avatar" :src="activeUser.login == '' ? 'unnamed.jpg' : imageData(activeUser.login)">
      <div class="active-user-text">
        {{ activeUser.name }} ( {{ activeUser.firstName }} {{ activeUser.lastName }} - {{ activeUser.position }})
      </div>
    </div>
    <hr color="#cccccc">
    <div class="chat-messages" ref="scrollContainer">
      <div class="message" :class="[message.senderId === this.currentUser.login ? 'sender-message' : 'recipient-message']"
        v-for="message in messages" :key="message.id">{{ message.content }}
      </div>
    </div>
    <div class="message-input-containter">
      <v-text-field class="message-input" v-model="messageInput" variant="filled" clear-icon="mdi-close-circle" clearable
        single-line label="Напишите сообщение..." @keyup.enter="sendMessage" type="text" hide-details="auto"
        @click:clear="clearMessage"></v-text-field>
      <v-btn class="message-button" icon="mdi-send" @click="sendMessage">
      </v-btn>
    </div>
  </div>
</template>
  
<script>
import { mapGetters } from 'vuex';

export default {
  data: () => ({
    messageInput: '',
    marker: true,
    iconIndex: 0,
    scrollContainer: null,
  }),
  props: {
    stompClient: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['messages']),
    icon() {
      return this.icons[this.iconIndex];
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
    imageData() {
      return (login) => {
        const avatar = localStorage.getItem(login)
        if (avatar == null) {
          return 'unnamed.jpg'
        } else {
          return localStorage.getItem(login)
        }
      }
    },
  },
  methods: {
    sendMessage() {
      if (this.messageInput.trim() !== "") {
        const message = {
          senderId: this.currentUser.login,
          recipientId: this.activeUser.login,
          senderName: this.currentUser.name,
          recipientName: this.activeUser.name,
          content: this.messageInput,
          timestamp: new Date(),
        };
        this.stompClient.send("/api/chat", {}, JSON.stringify(message));
        if (this.currentUser.login != this.activeUser.login) {
          this.$store.commit("ADD_MESSAGE", message)
        }
      }

      this.clearMessage()
    },
    clearMessage() {
      this.messageInput = ''
    },
    scrollDown(behavior) {
      this.$nextTick(() => {
        this.$refs.scrollContainer.scrollTo({ behavior, top: this.$refs.scrollContainer.scrollHeight })
      });
    }
  },
  watch: {
    activeUser() {
      this.scrollDown("instant")
    },
    messages() {
      this.scrollDown("smooth")
    },
  },
}

</script>

<style>
.chat-window {
  background-color: #f5f5f5;
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0px;
  border-radius: 0px 10px 10px 0px;
}

.active-user {
  background: #45607c;
  display: flex;
  align-items: center;
  min-height: 72px;
  border-radius: 0px 10px 0px 0px;
}

.active-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  clip-path: circle();
  margin-left: 10px;
}

.active-user-text {
  text-align: center;
  margin-left: 10px;
  color: white;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: scroll;
  gap: 50px;

}

.chat-messages::-webkit-scrollbar {
  width: 12px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: 20px;
  border: 3px solid #f5f5f5;
}

.message {
  border-radius: 10px;
  padding: 8px;
  width: max-content;
  max-width: 900px;
  white-space: normal;
  word-wrap: break-word;
  margin-top: 5px;
}

.sender-message {
  background-color: white;
  margin-left: auto;
  margin-right: 5px;
}

.recipient-message {
  background-color: #32465a;
  color: white;
  margin-left: 5px;
}

.message-input-containter {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.message-input {
  width: 94%;
}

.message-button {
  width: 6% !important;
  background-color: #32465a;
  border-radius: 0 0 10px !important;
  height: 100% !important;
  color: white;
}

.v-input__append {
  width: 50px !important;
  color: white;
  margin-left: 0px !important;
  background: #32465a;
  border-radius: 0px 5px 5px 0px;
  text-align: center !important;
  padding-left: 10px;

}
</style>