<template>
  <div class="chat-window">
    Чат
    <!-- <div class="chat-window" v-for="user in this.users" :key="user.id">Чат</div> -->
  </div>
</template>
  
<script>

export default {
  props: {
    users: {
      type: Array,
      required: true
    },
  }
}

</script>

<style>

.chat-window{
  background-color:khaki;
  width: 90%;
  height: 100%;

  float: left;
}

</style>