<template>
  <div id="app">
    <echec-game :game="game" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import EchecGame from '@/components/EchecGame.vue'
import Game from '@/scripts/rules'
import game from '@/maps/chessence'

@Options({ components: { EchecGame } })
export default class App extends Vue {
  game = new Game(game.map, game.pawnCount)
}
</script>

<style lang="scss">
  body {
    margin: 0;
    font-family: 'GT Pressura';
    text-transform: uppercase;
  }

  button {
    color: $color-borders;
    font-family: 'GT Pressura';
    text-transform: uppercase;
    font-weight: bold;
  }
</style>
