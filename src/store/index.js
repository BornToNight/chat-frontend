import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
    state() {
        return {
            accessToken: "",
            currentUser: {},
            messages: [],
            exsistsUnreadMessages: [],
            activeUser: {},
            users: [],
            avatars: [],
        }
    },
    getters: {
        accessToken: (state) => state.accessToken,
        currentUser: (state) => state.currentUser,
        messages: (state) => state.messages,
        exsistsUnreadMessages: (state) => state.exsistsUnreadMessages,
        activeUser: (state) => state.activeUser,
        users: (state) => state.users,
        avatars: (state) => state.avatars,
    },
    mutations: {
        SET_ACCESS_TOKEN(state, accessToken) {
            state.accessToken = accessToken
        },
        SET_CURRENT_USER(state, currentUser) {
            state.currentUser = currentUser
        },
        SET_MESSAGES(state, messages) {
            state.messages = messages
        },
        ADD_MESSAGE(state, message) {
            state.messages = [...state.messages, message]
        },
        ADD_EXSISTS_UNREAD_MESSAGES(state, exsistUnreadMessage) {
            state.exsistsUnreadMessages = [...state.exsistsUnreadMessages, exsistUnreadMessage]
        },
        DELETE_EXSISTS_UNREAD_MESSAGES(state, exsistUnreadMessage) {
            state.exsistsUnreadMessages = state.exsistsUnreadMessages.filter((element) => element !== exsistUnreadMessage)
        },
        SET_ACTIVE_USER(state, activeUser) {
            state.activeUser = activeUser
        },
        SET_USERS(state, users) {
            state.users = users
        },
        ADD_AVATAR(state, avatar) {
            state.avatars = [...state.avatars, avatar]
        },
    }

})

export default store