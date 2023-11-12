import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
    state() {
        return {
            accessToken: "",
            currentUser: {},
            userName: "",
            messages: [],
            activeUser: {},
        }
    },
    getters: {
        accessToken: (state) => state.accessToken,
        currentUser: (state) => state.currentUser,
        messages: (state) => state.messages,
        activeUser: (state) => state.activeUser,
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
        SET_ACTIVE_USER(state, activeUser) {
            state.activeUser = activeUser
        },
    }

})

export default store