const XX = 0 // empty square
const __ = 1 // removed square
const F1 = 2 // Fortress 1
const P1 = 3 // Pawn 1
const F2 = 4 // Fortress 2
const P2 = 5 // Pawn 2

export default {
  map: [
    [XX, XX, P2, F2, P2, XX, XX],
    [XX, P2, __, __, __, P2, XX],
    [__, __, __, P1, __, __, __],
    [__, __, __, XX, __, __, __],
    [__, __, __, P2, __, __, __],
    [XX, P1, __, __, __, P1, XX],
    [XX, XX, P1, F1, P1, XX, XX]
  ] as number[][],
  pawnCount: [8, 8]
}
