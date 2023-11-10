<template>
  <div class="chat-window">
    <div class="user-div" :class="[message.senderId === this.autalUser.login ? 'sender-message' : 'recipient-message']"
      v-for="message in messages" :key="message.id">{{ message.content }}</div>
    <v-text-field class="message-input" v-model="messageInput" append-icon="mdi-send" :prepend-icon="icon"
      variant="filled" clear-icon="mdi-close-circle" clearable label="Message" type="text" @click:append="sendMessage"
      @click:prepend="changeIcon" @click:clear="clearMessage"></v-text-field>
  </div>
</template>
  
<script>
import { mapState } from 'vuex';

export default {
  data: () => ({
    messageInput: 'Hey!',
    marker: true,
    iconIndex: 0,
    icons: [
      'mdi-emoticon',
      'mdi-emoticon-cool',
      'mdi-emoticon-dead',
      'mdi-emoticon-excited',
      'mdi-emoticon-happy',
      'mdi-emoticon-neutral',
      'mdi-emoticon-sad',
      'mdi-emoticon-tongue',
    ],
  }),
  props: {
    users: {
      type: Array,
      required: true
    },
    autalUser: {
      type: Object,
      required: true,
    },
    stompClient: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(['messages']),
    icon() {
      return this.icons[this.iconIndex];
    },
  },
  methods: {
    sendMessage() {

      if (this.messageInput.trim() !== "") {
        const message = {
          senderId: this.autalUser.login,
          recipientId: this.$store.getters["activeUser"].login,
          senderName: this.autalUser.name,
          recipientName: this.$store.getters["activeUser"].name,
          content: this.messageInput,
          timestamp: new Date(),
        };
        this.stompClient.send("/app/chat", {}, JSON.stringify(message));
      }

      this.resetIcon()
      this.clearMessage()
    },
    clearMessage() {
      this.messageInput = ''
    },
    resetIcon() {
      this.iconIndex = 0
    },
    changeIcon() {
      this.iconIndex === this.icons.length - 1
        ? this.iconIndex = 0
        : this.iconIndex++
    },
  },
}

</script>

<style>
.sender-message {
  width: 100%;
  text-align: right;
}

.recipient-message {
  width: 100%;
}

.chat-window {
  background-color: khaki;
  width: 90%;
  height: 100%;

  float: left;
}

.message-input {
  position: absolute;
  bottom: 0px;
  margin: 10px;
  width: 88%;
}
</style>