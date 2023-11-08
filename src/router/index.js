import LoginPage from '../components/LoginPage.vue'
import ChatPage from '../components/ChatPage.vue'
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