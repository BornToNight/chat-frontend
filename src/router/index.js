import LoginPage from '../pages/LoginPage.vue'
import ChatPage from '../pages/ChatPage.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    { path: '/login', component: LoginPage },
    { path: '/chat', component: ChatPage },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router