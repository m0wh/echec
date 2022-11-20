import { NOBODY, EMPTY_TERRAIN, TERRAIN, NO_PAWN } from '@/scripts/consts'

export default class Game {
  map: number[][] // terrain and fortresses
  initialBoard: number[][] // to know where the pawns can spawn
  board: number[][] // pawn positions
  playerCount: number // number of players in the game
  reserve: number[] = [] // reserve pawns of each player
  fortressCount: number[] = [] // number of fortresses of each player
  round = 0 // current round (counting dead players rounds)
  playedRounds = 0 // count of played rounds
  winner?: number = undefined

  constructor (map: number[][], pawnCount: number[]) {
    this.playerCount = (Math.max(...map.flat()) - 1) / 2

    this.map = map.map(row => {
      return row.map(square => {
        if (square === 0) return 0 // is a removed square
        if (square % 2 === 0) return square / 2 + 1 // is a fortress
        return 1 // else, is a normal square
      })
    })

    this.board = map.map(row => {
      return row.map(square => {
        if (square % 2 === 1) return (square - 1) / 2 - 1 // is a pawn
        return -1
      })
    })
    this.initialBoard = this.board.map(row => ([...row]))

    for (let playerIndex = 0; playerIndex < this.playerCount; playerIndex++) {
      const fortressCode = playerIndex + 2
      const pawnCode = playerIndex

      this.fortressCount[playerIndex] = this.map.flat().filter(s => s === fortressCode).length
      this.reserve[playerIndex] = Math.max(0, pawnCount[playerIndex] - this.board.flat().filter(c => c === pawnCode).length)
    }
  }

  getMapSquare (square: Coordinates, offset: [number, number] = [0, 0]): number {
    const newSquare = [square[0] + offset[0], square[1] + offset[1]]

    const isOnTheBoard = newSquare[0] >= 0 && newSquare[0] < this.width && newSquare[1] >= 0 && newSquare[1] < this.height
    if (!isOnTheBoard) return 0

    return this.map[newSquare[1]][newSquare[0]]
  }

  getSquarePlayer (square: Coordinates, offset: [number, number] = [0, 0]): number {
    const newSquare = [square[0] + offset[0], square[1] + offset[1]]

    const isOnTheBoard = newSquare[0] >= 0 && newSquare[0] < this.width && newSquare[1] >= 0 && newSquare[1] < this.height
    if (!isOnTheBoard) return NO_PAWN

    return this.board[newSquare[1]][newSquare[0]]
  }

  wherePawnCanMove (pawn: Coordinates): Coordinates[] {
    const isOnTheBoard = pawn[0] >= 0 && pawn[0] < this.width && pawn[1] >= 0 && pawn[1] < this.height
    if (!isOnTheBoard) return [] // pawn have to be on the board

    const orthogonalOffsets = [[0, -1], [1, 0], [0, 1], [-1, 0]] as [number, number][]
    const diagonalOffsets = [[1, -1], [1, 1], [-1, 1], [-1, -1]] as [number, number][]
    const knightOffsets = [[1, -2], [2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2]] as [number, number][]

    const haveOrthogonalFriend = orthogonalOffsets.findIndex(offset => this.getSquarePlayer(pawn, offset) === this.getSquarePlayer(pawn)) >= 0
    const haveDiagonalFriend = diagonalOffsets.findIndex(offset => this.getSquarePlayer(pawn, offset) === this.getSquarePlayer(pawn)) >= 0
    const haveKnightFriend = knightOffsets.findIndex(offset => this.getSquarePlayer(pawn, offset) === this.getSquarePlayer(pawn)) >= 0

    const options: Coordinates[] = []

    if (haveOrthogonalFriend) {
      orthogonalOffsets.forEach(offset => {
        let i = 1
        let pos: Coordinates = [pawn[0] + i * offset[0], pawn[1] + i * offset[1]]
        while (
          this.getMapSquare(pos) === TERRAIN && // blocked by invalid square
          this.getSquarePlayer(pos) === NO_PAWN // is not on another pawn
        ) {
          options.push(pos)
          i++
          pos = [pawn[0] + i * offset[0], pawn[1] + i * offset[1]]
        }
        options.push(pos)
      })
    }

    if (haveDiagonalFriend) {
      diagonalOffsets.forEach(offset => {
        let i = 1
        let pos: Coordinates = [pawn[0] + i * offset[0], pawn[1] + i * offset[1]]
        while (
          this.getMapSquare(pos) === TERRAIN && // blocked by invalid square
          this.getSquarePlayer(pos) === NO_PAWN // is not on another pawn
        ) {
          options.push(pos)
          i++
          pos = [pawn[0] + i * offset[0], pawn[1] + i * offset[1]]
        }
        options.push(pos)
      })
    }

    if (haveKnightFriend) {
      knightOffsets.forEach(offset => {
        options.push([pawn[0] + offset[0], pawn[1] + offset[1]])
      })
    }

    return options.filter(option => {
      return [
        this.getSquarePlayer(option) !== this.currentPlayer,
        this.getMapSquare(option) !== EMPTY_TERRAIN,
        this.getMapSquare(option) !== this.getSquarePlayer(pawn) + 2 // not on his own fortress
      ].every(c => c)
    })
  }

  endRound (): void {
    this.map.forEach((row, rowIndex) => { // check each square
      row.forEach((square, colIndex) => {
        if (square === EMPTY_TERRAIN || square === TERRAIN) return // if not a fortress we don't care
        if (this.board[rowIndex][colIndex] === NOBODY) return // no one on this square

        const fortressPlayer = square - 2 // the player who owns this fortress
        const pawnPlayer = this.board[rowIndex][colIndex] // the player who owns the pawn

        if (fortressPlayer !== pawnPlayer) { // fortress is destroyed
          /* a lot of game mechanics can be set here, for example
          - take control of fortress
          - own the spawn points near it
          - put pawn in reserve */

          /* fortress is replaced by a removed square */
          // this.map[rowIndex][colIndex] = EMPTY_TERRAIN // remove fortress
          // this.fortressCount[fortressPlayer]--

          /* fortress is replaced by a normal square */
          this.map[rowIndex][colIndex] = TERRAIN // remove fortress
          this.fortressCount[fortressPlayer]--

          /* fortress is captured by attacker */
          // this.map[rowIndex][colIndex] = pawnPlayer + 2 // capture the fortress

          /* attacker goes back to reserve */
          // this.board[rowIndex][colIndex] = NOBODY // remove pawn from board
          // this.reserve[pawnPlayer]++ // add pawn to reserve

          /* attacker dies */
          // this.board[rowIndex][colIndex] = NOBODY // remove pawn from board

          /* attacker converts loser pawns */
          // if (this.fortressCount[fortressPlayer] === 0) { // a player died
          //   this.board = this.board.map(row => row.map(sq => sq === fortressPlayer ? pawnPlayer : sq))
          // }
        }
      })

      for (let player = 0; player < this.playerCount; player++) {
        if (this.fortressCount[player] === 0) { // a player died
          this.board = this.board.map(row => row.map(sq => sq === player ? NOBODY : sq)) // remove all of his pawns from board
          this.reserve[player] = 0 // empty his reserve
        }
      }
    })

    if (this.activePlayers.length === 1) {
      this.winner = this.activePlayers[0]
      return // we have a winner
    }

    if (this.activePlayers.length === 0) {
      this.winner = this.activePlayers[0]
      return // everybody died, this is to prevent from infinite loop, just in case
    }

    do { this.round++ } while (!this.board.flat().includes(this.currentPlayer))
    this.playedRounds++
  }

  movePawn (pawn: Coordinates, to: Coordinates): boolean {
    if (pawn[0] < 0 || pawn[0] >= this.width || pawn[1] < 0 || pawn[1] >= this.height) return false // pawn have to be on the board
    if (this.getSquarePlayer(pawn) !== this.currentPlayer) return false // pawn have to be owned by player
    if (!(this.wherePawnCanMove(pawn).findIndex(c => c[0] === to[0] && c[1] === to[1]) >= 0)) return false // destination has to be valid

    this.board[pawn[1]][pawn[0]] = NOBODY
    this.board[to[1]][to[0]] = this.currentPlayer
    this.endRound()
    return true
  }

  placePawn (to: Coordinates): boolean {
    if (this.getSquarePlayer(to) === this.currentPlayer) return false // pawn have to be owned by player
    if (this.reserve[this.currentPlayer] <= 0) return false // player needs reserve
    if (this.initialBoard[to[1]][to[0]] !== this.currentPlayer) return false

    this.board[to[1]][to[0]] = this.currentPlayer as PawnValue
    this.reserve[this.currentPlayer]--
    this.endRound()
    return true
  }

  get currentPlayer () {
    return this.round % this.playerCount
  }

  get activePlayers () {
    return [...new Set(this.board.flat().filter(s => s !== NOBODY))]
  }

  get width () {
    return this.map[0].length
  }

  get height () {
    return this.map.length
  }
}
