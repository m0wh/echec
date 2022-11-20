const XX = 0 // empty square
const __ = 1 // removed square
const F1 = 2 // Fortress 1
const P1 = 3 // Pawn 1
const F2 = 4 // Fortress 2
const P2 = 5 // Pawn 2

export default {
  map: [
    [F2, P2, __, __, __, __],
    [P2, P2, P2, __, __, XX],
    [__, P2, P2, __, XX, __],
    [__, __, XX, __, __, __],
    [__, XX, __, __, XX, __],
    [__, __, __, XX, __, __],
    [__, XX, __, P1, P1, __],
    [XX, __, __, P1, P1, P1],
    [__, __, __, __, P1, F1]
  ] as number[][],
  pawnCount: [9, 9] // pawns per player
}
