import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import firebase from 'firebase/app'

Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>',
  created () {
    let firebaseConfig = {
      apiKey: 'AIzaSyB8YGQS9bBp4QDx4qUWoUI1nn2YAQGlmfA',
      authDomain: 'itc-ads-6ff92.firebaseapp.com',
      projectId: 'itc-ads-6ff92',
      storageBucket: 'itc-ads-6ff92.appspot.com',
      messagingSenderId: '410483419673',
      appId: '1:410483419673:web:f5789b0346d6a7af3b5888'
    }
    firebase.initializeApp(firebaseConfig)

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoLoginUser', user)
      }
    })
  }
})
