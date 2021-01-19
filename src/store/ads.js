/* eslint-disable */
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'

class Ad {
  constructor (title, description, ownerId, imageSrc='https://wallpaperscave.ru/images/original/18/04-27/sci-fi-space-45449.jpg', promo = false, id = null) {
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
      // {
      //   title: 'First ad',
      //   description: 'Hello i am description',
      //   promo: false,
      //   imageSrc: 'https://img5.goodfon.ru/original/1920x1200/8/49/hot-pocket-zvezdy-kosmos-tumannost-fantasy-art-stars-space-a.jpg',
      //   id: '123'
      // },
      // {
      //   title: 'Second ad',
      //   description: 'Hello i am description',
      //   promo: true,
      //   imageSrc: 'https://avatanplus.com/files/resources/original/574ea16f59ef51550b269b08.jpg',
      //   id: '1234'
      // },
      // {
      //   title: 'Third ad',
      //   description: 'Hello i am description',
      //   promo: true,
      //   imageSrc: 'https://wallpaperscave.ru/images/original/18/03-12/sci-fi-planets-27960.jpg',
      //   id: '12345'
      // }
    ]
  },
  mutations: {
    createAd (state, payload) {
      state.ads.push(payload)
    },
    loadAds (state, payload) {
      state.ads = payload
    },
    updateAd (state, {title, description, id}) {
      const ad = state.ads.find(a=>{
        return a.id === id
      })
      ad.title = title
      ad.description = description
    }
  },
  actions: {
    async createAd ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      
      const image = payload.image

      try {
        const newAd = new Ad(
          payload.title, 
          payload.description, 
          getters.user.id, 
          '', 
          payload.promo
          )
        const ad = await firebase.database().ref('ads').push(newAd)
        const imageExt = image.name.slice(image.name.lastIndexOf('.'))
        
        const fileData = await firebase.storage().ref(`ads/${ad.key}${imageExt}`).put(image)
        const imageSrc = await firebase.storage().ref().child(fileData.ref.fullPath).getDownloadURL()

        await firebase.database().ref('ads').child(ad.key).update({
          imageSrc: imageSrc
        })
        commit('setLoading', false)
        commit('createAd', {
          ...newAd,
          id: ad.key,
          imageSrc: imageSrc
        })
        
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', error.false)
        throw error
      }
      
    },
    async fetchAds ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      
      
      const resultAds = []
      
      try {
        const fbVal = await firebase.database().ref('ads').once('value')
        const ads = fbVal.val()
        Object.keys(ads).forEach(key=>{
          const ad = ads[key]
          resultAds.push(
            new Ad(ad.title, ad.description, ad.ownerId, ad.imageSrc, ad.promo, key)
          )
        })

        commit('loadAds', resultAds)
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async updateAd ({commit}, {title, description, id}) {
      commit('clearError'),
      commit('setLoading', true)

      try {
        await firebase.database().ref('ads').child(id).update({
          title, description
        })
        commit ('updateAd', {
          title, description, id
        })
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
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
    myAds (state, getters) {
      return state.ads.filter(ad =>{
        return ad.ownerId === getters.user.id
      })
    },
    adById (state) {
      return adId => {
        return state.ads.find(ad => ad.id === adId)
      }
    }
  }
}
