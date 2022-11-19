import { NOBODY, PLAYER_1, PLAYER_2, EMPTY_TERRAIN, TERRAIN, FORTRESS_1, FORTRESS_2, NO_PAWN, PAWN_1, PAWN_2 } from '@/scripts/consts'

type Coordinates = [number, number]
type PawnValue = 0 | 1 | -1
type MapValue = 0 | 1 | 2 | 3

export default class Game {
  map: MapValue[][]
  initialBoard: PawnValue[][]
  board: PawnValue[][]
  reserve = [0, 0]
  scores = [0, 0]
  neededScore = [1, 1]
  round = 0

  constructor (map: MapValue[][], board: PawnValue[][], pawnCount: number) {
    this.map = map.map(row => ([...row]))
    this.board = board.map(row => ([...row]))
    this.initialBoard = board.map(row => ([...row]))

    this.neededScore[PLAYER_1] = this.map.flat().filter(s => s === FORTRESS_1).length
    this.neededScore[PLAYER_2] = this.map.flat().filter(s => s === FORTRESS_2).length

    this.reserve[PLAYER_1] = Math.max(0, pawnCount - board.flat().filter(c => c === PAWN_1).length)
    this.reserve[PLAYER_2] = Math.max(0, pawnCount - board.flat().filter(c => c === PAWN_2).length)
  }

  getMapSquare (square: Coordinates, offset: [number, number] = [0, 0]): MapValue {
    const newSquare = [square[0] + offset[0], square[1] + offset[1]]

    const isOnTheBoard = newSquare[0] >= 0 && newSquare[0] < this.width && newSquare[1] >= 0 && newSquare[1] < this.height
    if (!isOnTheBoard) return 0

    return this.map[newSquare[1]][newSquare[0]]
  }

  getSquarePlayer (square: Coordinates, offset: [number, number] = [0, 0]): PawnValue {
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
    this.map.flat().forEach((square, i) => {
      const player1Fortress = square === FORTRESS_1
      const player2Fortress = square === FORTRESS_2
      const player1Pawn = this.board.flat()[i] === PLAYER_1
      const player2Pawn = this.board.flat()[i] === PLAYER_2
      if (player2Fortress && player1Pawn) this.scores[PLAYER_1]++ // point for Player 1
      if (player1Fortress && player2Pawn) this.scores[PLAYER_2]++ // point for Player 2
    })

    let winner = NOBODY
    if (this.scores[PLAYER_1] >= this.neededScore[PLAYER_1]) winner = PLAYER_1
    if (this.scores[PLAYER_2] >= this.neededScore[PLAYER_2]) winner = PLAYER_2
    if (winner < 0) this.round++
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
    return this.round % 2 as 0 | 1
  }

  get width () {
    return this.map[0].length
  }

  get height () {
    return this.map.length
  }
}
