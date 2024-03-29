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
    [F3, P3, P3, __, __, P4, F4],
    [P3, P3, __, __, __, P4, P4],
    [__, __, __, __, __, __, P4],
    [__, __, __, XX, __, __, __],
    [P2, __, __, __, __, __, __],
    [P2, P2, __, __, __, P1, P1],
    [F2, P2, __, __, P1, P1, F1]
  ] as number[][],
  pawnCount: [6, 6, 6, 6]
}
