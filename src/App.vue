<template>
  <div id="app" :class="`player${currentPlayer + 1}-playing`" @click.self="clickSomewhere">
    <div class="set">
      <div class="reserve reserve2" @click="clickSomewhere"><button class="pawn" v-for="(reservePawn, i) of game.reserve[1]" :key="`reserve-${i}`" /></div>
      <div class="board">
        <div class="row" v-for="(row, rowIndex) in game.map" :key="`row-${rowIndex}`">
          <div class="square"
            @click.self="clickSomewhere"
            v-for="(square, columnIndex) in row"
            :key="`row-${columnIndex}`"
            :class="[['empty', '', 'fortress1', 'fortress2'][square], (selectedPawn && selectedPawn[0] === columnIndex && selectedPawn[1] === rowIndex) ? 'selected' : '']">
            <button class="moving-option"
              v-if="selectedPawn && movingOptions.findIndex(o => o[0] === columnIndex && o[1] === rowIndex) >= 0"
              :class="[`player${game.board[rowIndex][columnIndex] + 1}`]"
              @click="movePawn(selectedPawn, [columnIndex, rowIndex])"
            />
            <button class="pawn"
              v-else-if="game.board[rowIndex][columnIndex] >= 0"
              :class="[`player${game.board[rowIndex][columnIndex] + 1}`, currentPlayer !== game.board[rowIndex][columnIndex] ? 'disabled' : '']"
              @click="currentPlayer !== game.board[rowIndex][columnIndex] ? clickSomewhere() : selectPawn([columnIndex, rowIndex])"
            />
            <button class="placing-option"
              v-else-if="
                !selectedPawn &&
                game.initialBoard[rowIndex][columnIndex] === currentPlayer &&
                game.reserve[currentPlayer] > 0
              "
              :class="[`player${game.board[rowIndex][columnIndex] + 1}`]"
              @click="placePawn([columnIndex, rowIndex])"
            />
            <svg v-else-if="square > 1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 28 28" width="28px" height="28px"><path d="M28 27H0V0l8.2 11.3L14 0l5.8 11.3L28 0v27Z"/></svg>
          </div>
        </div>
      </div>
      <div class="reserve reserve1" @click="clickSomewhere"><button class="pawn" v-for="(reservePawn, i) of game.reserve[0]" :key="`reserve-${i}`" /></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import { State } from 'vuex-class'
import Game from './scripts/rules'

export default class App extends Vue {
  @State game!: Game
  selectedPawn: [number, number] | null = null

  clickSomewhere () {
    this.selectedPawn = null
  }

  selectPawn (pawn: [number, number]) {
    this.selectedPawn = pawn
  }

  movePawn (pawn: [number, number], to: [number, number]) {
    if (!pawn) return
    const success = this.game.movePawn(pawn, to)
    if (success) this.selectedPawn = null
  }

  placePawn (to: [number, number]) {
    const success = this.game.placePawn(to)
    if (success) this.selectedPawn = null
  }

  get currentPlayer () {
    return this.game.round % 2
  }

  get movingOptions () {
    if (!this.selectedPawn) return []
    return this.game.wherePawnCanMove(this.selectedPawn)
  }
}
</script>

<style lang="scss">
  body {
    margin: 0;
  }

  #app {
    display: flex;
    height: 100vh;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: $color-background;
    color: $color-borders;
    transition: background-color 0.5s linear 0.5s;

    /* &.player1-playing { background-color: $color-player1; }
    &.player2-playing { background-color: $color-player2; } */
  }

  .set {
    .reserve {
      display: flex;
      align-items: center;
      margin: 0 #{$border-width / 2};
      height: $square-size * 0.75;

      &.reserve1 {
        justify-content: flex-end;
        .pawn::after { background-color: $color-player1; }
      }
      &.reserve2 {
        justify-content: flex-start;
        .pawn::after { background-color: $color-player2; }
      }

      .pawn {
        display: block;
        width: $square-size * 0.6;
        height: $square-size * 0.6;
        border: none;
        margin: 0;
        padding: 0;
        background: none;
        display: flex;
        justify-content: center;
        align-items: center;

        &::after {
          content: '';
          border-radius: 50%;
          display: block;
          width: $pawn-size;
          height: $pawn-size;
          border: $border-width solid $color-borders;
        }
      }
    }

    &, .fortress1 svg, .fortress2 svg {
      transition: transform .5s cubic-bezier(0.165, 0.84, 0.44, 1) 0.5s;
    }

    .player2-playing & {
      transform: rotate(180deg);
    }

    .board {
      border: #{$border-width / 2} solid $color-borders;

      .row {
        height: $square-size;
        display: flex;

        &:nth-of-type(odd) .square:nth-of-type(odd) { background-color: $color-square2; }
        &:nth-of-type(even) .square:nth-of-type(even) { background-color: $color-square2; }

        .square {
          width: calc(#{$square-size} - #{$border-width});
          height: calc(#{$square-size} - #{$border-width});
          background-color: $color-square1;
          border: #{$border-width / 2} solid $color-borders;

          &.selected {
            border-color: $color-selection;
            box-shadow: 0 0 0 #{$border-width / 2} $color-selection;
            z-index: 1;
          }

          &.empty { background-color: $color-squareempty !important; }

          &.fortress1 {
            background-color: $color-player1 !important;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          &.fortress2 {
            background-color: $color-player2 !important;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          svg {
            width: $pawn-size * 0.9;
            height: $pawn-size * 0.9;

            .player2-playing & {
              transform: rotate(-180deg);
            }
          }

          .pawn, .moving-option, .placing-option {
            cursor: pointer;
            display: block;
            width: 100%;
            height: 100%;
            border: none;
            margin: 0;
            padding: 0;
            background: none;
            display: flex;
            justify-content: center;
            align-items: center;

            &::after {
              content: '';
              border-radius: 50%;
              display: block;
              width: $pawn-size;
              height: $pawn-size;
            }

            &.player1::after { background-color: $color-player1; }
            &.player2::after { background-color: $color-player2; }
          }

          .pawn {
            &.disabled {
              cursor: default;
            }

            &::after {
              border: $border-width solid $color-borders;
            }
          }

          .moving-option {
            &::after {
              border: $border-width solid $color-selection;
            }

            &:hover::after {
              background-color: $color-selection;
            }

            &.player1::after { background-color: $color-player1; }
            &.player2::after { background-color: $color-player2; }
          }

          .placing-option {
            &::after {
              border: $border-width solid $color-selection;
            }

            &:hover::after {
              background-color: $color-selection;
            }

            &.player1::after { background-color: $color-player1; }
            &.player2::after { background-color: $color-player2; }
          }
        }
      }
    }
  }
</style>
