import Game from '@/scripts/rules'
import { createStore } from 'vuex'
import game from '@/maps/chessence'

export default createStore({
  state: {
    game: new Game(game.map, game.board, game.pawnCount),
    round: 0
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
