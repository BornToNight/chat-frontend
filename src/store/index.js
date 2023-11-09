import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
    state() {
        return {
            accessToken: "",
            login: "",
        }
    },
    getters: {
        accessToken: (state) => state.accessToken,
        login: (state) => state.login,
    },
    mutations: {
        SET_ACCESS_TOKEN(state, accessToken) {
            state.accessToken = accessToken
        },
        SET_LOGIN(state, login) {
            state.login = login
        },
    }

})

export default store