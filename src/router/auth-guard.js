/* eslint-disable */
import store from '../store/index.js'

export default function (to, from, next) {
    if(store.getters.user) {
        next()
    } else {
        next('/login?loginError=true')
    }

}