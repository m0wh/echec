<template>
  <div class="echec-game" :class="game.winner === undefined ? `player${game.currentPlayer + 1}-playing` : ''" @click.self="clickSomewhere">
    <div v-if="game.winner === undefined" class="set">
      <div class="reserves" @click="clickSomewhere">
        <button v-for="(reserve, i) in game.reserve" :class="`reserve reserve${i + 1}`" :key="`reserve-${i}`">{{ reserve }}</button>
      </div>
      <div class="board">
        <div class="row" v-for="(row, rowIndex) in game.map" :key="`row-${rowIndex}`">
          <div class="square"
            @click.self="clickSomewhere"
            v-for="(square, columnIndex) in row"
            :key="`row-${columnIndex}`"
            :class="{
              selected: selectedPawn && selectedPawn[0] === columnIndex && selectedPawn[1] === rowIndex,
              empty: square === 0,
              fortress: square > 1
            }"
            :data-player="square > 1 ? square - 1 : ''">
            <button class="moving-option"
              v-if="selectedPawn && movingOptions.findIndex(o => o[0] === columnIndex && o[1] === rowIndex) >= 0"
              :class="[`player${game.board[rowIndex][columnIndex] + 1}`]"
              @click="movePawn(selectedPawn, [columnIndex, rowIndex])"
            />
            <button class="pawn"
              v-else-if="game.board[rowIndex][columnIndex] >= 0"
              :class="[`player${game.board[rowIndex][columnIndex] + 1}`, game.currentPlayer !== game.board[rowIndex][columnIndex] ? 'disabled' : '']"
              @click="game.currentPlayer !== game.board[rowIndex][columnIndex] ? clickSomewhere() : selectPawn([columnIndex, rowIndex])"
            />
            <button class="placing-option"
              v-else-if="
                !selectedPawn &&
                game.initialBoard[rowIndex][columnIndex] === game.currentPlayer &&
                game.reserve[game.currentPlayer] > 0
              "
              :class="[`player${game.board[rowIndex][columnIndex] + 1}`]"
              @click="placePawn([columnIndex, rowIndex])"
            />
            <svg v-else-if="square > 1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 28 28" width="28px" height="28px"><path d="M28 27H0V0l8.2 11.3L14 0l5.8 11.3L28 0v27Z"/></svg>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="winner" :class="`winner-${game.winner + 1}`">
      <div class="announcement">
        <div class="badge">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 28 28" width="28px" height="28px"><path d="M28 27H0V0l8.2 11.3L14 0l5.8 11.3L28 0v27Z"/></svg>
        </div>
        <!--  in {{ game.playedRounds + 1 }} round{{ game.playedRounds === 1 ? 's' : '' }} -->
        <p>Player {{ game.winner + 1 }} won the game!</p>
      </div>
      <a href="/">New game</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component'
import Game from '@/scripts/rules'

class Props {
  game: Game = prop({ required: true })
}

@Options({})
export default class EchecGame extends Vue.with(Props) {
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

  get movingOptions () {
    if (!this.selectedPawn) return []
    return this.game.wherePawnCanMove(this.selectedPawn)
  }
}
</script>

<style lang="scss">
  .echec-game {
    display: flex;
    height: 100vh;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: $color-background;
    color: $color-borders;
    transition: background-color 0.5s linear;

    @each $i, $player-color in $player-colors {
      &.player#{$i}-playing { background-color: $player-color; }
    }
  }

  .set {
    .reserves {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 #{$border-width / 2};
      height: $square-size * 0.75;

      .reserve {
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
        border-radius: 50%;
        border: $border-width solid $color-borders;
        margin: 0 $border-width / 2;
        font-weight: bold;

        @each $i, $player-color in $player-colors {
          &#{$i} {
            background-color: $player-color;
          }
        }
      }
    }

    &, .fortress svg {
      transition: transform .5s cubic-bezier(0.165, 0.84, 0.44, 1) 0.5s;
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

          &.fortress {
            display: flex;
            align-items: center;
            justify-content: center;

            @each $i, $player-color in $player-colors {
              &[data-player="#{$i}"] {
                background-color: $player-color !important;

                .player#{$i}-playing & {
                  background-color: $color-borders !important;

                  svg {
                    color: $player-color;
                  }
                }
              }
            }
          }

          svg {
            width: $pawn-size * 0.9;
            height: $pawn-size * 0.9;
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
            position: relative;

            &::after {
              content: '';
              position: absolute;
              border-radius: 50%;
              display: block;
              width: $pawn-size;
              height: $pawn-size;
            }

            @each $i, $player-color in $player-colors {
              &.player#{$i}::after { background-color: $player-color; }
            }
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

            @each $i, $player-color in $player-colors {
              &.player#{$i}::after { background-color: $player-color; }
            }
          }

          .placing-option {
            &::after, &::before {
              content: '';
              height: $border-width;
              width: $pawn-size;
              background-color: $color-borders;
              position: absolute;
              border-radius: inherit;
              display: block;
            }

            &::before {
              width: $border-width;
              height: $pawn-size;
            }

            &:hover::after, &:hover::before {
              background-color: $color-selection;
            }
          }
        }
      }
    }
  }

  .winner {
    text-align: center;

    @each $i, $player-color in $player-colors {
      &.winner-#{$i} {
        .badge { background-color: $player-color; }
      }
    }

    .announcement {
      margin-top: 20px;

      .badge {
        width: 100px;
        height: 100px;
        border: $border-width solid $color-borders;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        margin: 0 auto;
      }

      p {
        color: $color-selection;
        font-size: 40px;
        font-weight: bold;
        margin: 30px;
        line-height: 1;
      }
    }

    a {
      text-decoration: none;
      padding: 10px 20px;
      background-color: $color-borders;
      color: $color-selection;
      border: $border-width solid $color-borders;
      display: inline-block;
      font-weight: bold;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 20px;

      &:hover {
        background-color: $color-square1;
        color: $color-borders;
      }
    }
  }
</style>
