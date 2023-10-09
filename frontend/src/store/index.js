import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

const vueexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default createStore({
  state() {
    return {
      authenticated: false,
      token: null,
      userId: null
    }
  },
  getters: {
    authenticated: state => state.authenticated,
    token: state => state.token,
    userId: state => state.userId,
  },
  mutations: { //posso salvar aqui tambem o carrinho de compras do usuario, para ter facil acesso
    authenticate(state, data){
      state.authenticated = true
      state.token = data.token
      state.userId = data.userId
    },
    logout(state){
      state.authenticated = false
      state.token = null
      state.userId = null
    }
  },
  actions: {
  },
  plugins: [vueexLocal.plugin]
})
