/* eslint-disable */
import firebase from 'firebase/app'
import 'firebase/database'

class Ad {
  constructor (title, description, ownerId=Math.floor(Math.random()*100), imageSrc='https://wallpaperscave.ru/images/original/18/04-27/sci-fi-space-45449.jpg', promo = false, id = null) {
    this.title = title
    this.description = description
    this.ownerId = ownerId
    this.imageSrc = imageSrc
    this.promo = promo
    this.id = id
  }
}


export default {
  state: {
    ads: [
      {
        title: 'First ad',
        description: 'Hello i am description',
        promo: false,
        imageSrc: 'https://img5.goodfon.ru/original/1920x1200/8/49/hot-pocket-zvezdy-kosmos-tumannost-fantasy-art-stars-space-a.jpg',
        id: '123'
      },
      {
        title: 'Second ad',
        description: 'Hello i am description',
        promo: true,
        imageSrc: 'https://avatanplus.com/files/resources/original/574ea16f59ef51550b269b08.jpg',
        id: '1234'
      },
      {
        title: 'Third ad',
        description: 'Hello i am description',
        promo: true,
        imageSrc: 'https://wallpaperscave.ru/images/original/18/03-12/sci-fi-planets-27960.jpg',
        id: '12345'
      }
    ]
  },
  mutations: {
    createAd (state, payload) {
      state.ads.push(payload)
    }
  },
  actions: {
    async createAd ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)

      try {
        const newAd = new Ad(
          payload.title, 
          payload.description, 
          getters.user.id, 
          payload.imageSrc, 
          payload.promo
          )
        const ad = await firebase.database().ref('ads').push(newAd)
        commit('setLoading', false)
        commit('createAd', {
          ...newAd,
          id: ad.key
        })
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', error.false)
        throw error
      }
      
    }
  },
  getters: {
    ads (state) {
      return state.ads
    },
    promoAds (state) {
      return state.ads.filter(ad => {
        return ad.promo
      })
    },
    myAds (state) {
      return state.ads
    },
    adById (state) {
      return adId => {
        return state.ads.find(ad => ad.id === adId)
      }
    }
  }
}
