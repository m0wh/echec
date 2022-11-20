const XX = 0 // empty square
const __ = 1 // removed square
const F1 = 2 // Fortress 1
const P1 = 3 // Pawn 1
const F2 = 4 // Fortress 2
const P2 = 5 // Pawn 2
const F3 = 6 // Fortress 3
const P3 = 7 // Pawn 3
const F4 = 8 // Fortress 4
const P4 = 9 // Pawn 4

export default {
  map: [
    [2, 4, 6, 8, 10, 12, 14, 16, 0],
    [3, 5, 7, 9, 11, 13, 15, 17, 1],
    [3, 5, 7, 9, 11, 13, 15, 17, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1]
  ] as number[][],
  pawnCount: [2, 2, 2, 2, 2, 2, 2, 2]
}
