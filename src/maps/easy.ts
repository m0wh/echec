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
    [F2, P2],
    [__, P2],
    [P2, P1],
    [P1, __],
    [P1, F1]
  ] as number[][],
  pawnCount: [6, 6, 6, 6]
}
