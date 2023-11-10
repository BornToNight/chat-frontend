import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
    state() {
        return {
            accessToken: "",
            atualUser: {},
            userName: "",
            messages: [],
            activeUser: {},
        }
    },
    getters: {
        accessToken: (state) => state.accessToken,
        atualUser: (state) => state.atualUser,
        messages: (state) => state.messages,
        activeUser: (state) => state.activeUser,
    },
    mutations: {
        SET_ACCESS_TOKEN(state, accessToken) {
            state.accessToken = accessToken
        },
        SET_ATUAL_USER(state, atualUser) {
            state.atualUser = atualUser
        },
        SET_MESSAGES(state, messages) {
            state.messages = messages
        },
        SET_ACTIVE_USER(state, activeUser) {
            state.activeUser = activeUser
        },
    }

})

export default store