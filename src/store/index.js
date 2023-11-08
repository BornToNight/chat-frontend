import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
    state() {
        return {
            accessToken: "",
        }
    },
    getters: {
        accessToken: (state) => state.accessToken
    },
    mutations: {
        SET_ACCESS_TOKEN(state, accessToken) {
            state.accessToken = accessToken
        }
    }
})

export default store