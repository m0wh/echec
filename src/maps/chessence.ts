import { EMPTY_TERRAIN, TERRAIN, FORTRESS_1, FORTRESS_2, NO_PAWN, PAWN_1, PAWN_2 } from '@/scripts/consts'

export default {
  map: [
    [FORTRESS_2, TERRAIN, TERRAIN, TERRAIN, TERRAIN, TERRAIN],
    [TERRAIN, TERRAIN, TERRAIN, TERRAIN, TERRAIN, EMPTY_TERRAIN],
    [TERRAIN, TERRAIN, TERRAIN, TERRAIN, EMPTY_TERRAIN, TERRAIN],
    [TERRAIN, TERRAIN, EMPTY_TERRAIN, TERRAIN, TERRAIN, TERRAIN],
    [TERRAIN, EMPTY_TERRAIN, TERRAIN, TERRAIN, EMPTY_TERRAIN, TERRAIN],
    [TERRAIN, TERRAIN, TERRAIN, EMPTY_TERRAIN, TERRAIN, TERRAIN],
    [TERRAIN, EMPTY_TERRAIN, TERRAIN, TERRAIN, TERRAIN, TERRAIN],
    [EMPTY_TERRAIN, TERRAIN, TERRAIN, TERRAIN, TERRAIN, TERRAIN],
    [TERRAIN, TERRAIN, TERRAIN, TERRAIN, TERRAIN, FORTRESS_1]
  ] as MapValue[][],
  board: [
    [NO_PAWN, PAWN_2, NO_PAWN, NO_PAWN, NO_PAWN, NO_PAWN],
    [PAWN_2, PAWN_2, PAWN_2, NO_PAWN, NO_PAWN, NO_PAWN],
    [NO_PAWN, PAWN_2, PAWN_2, NO_PAWN, NO_PAWN, NO_PAWN],
    [NO_PAWN, NO_PAWN, NO_PAWN, NO_PAWN, NO_PAWN, NO_PAWN],
    [NO_PAWN, NO_PAWN, NO_PAWN, NO_PAWN, NO_PAWN, NO_PAWN],
    [NO_PAWN, NO_PAWN, NO_PAWN, NO_PAWN, NO_PAWN, NO_PAWN],
    [NO_PAWN, NO_PAWN, NO_PAWN, PAWN_1, PAWN_1, NO_PAWN],
    [NO_PAWN, NO_PAWN, NO_PAWN, PAWN_1, PAWN_1, PAWN_1],
    [NO_PAWN, NO_PAWN, NO_PAWN, NO_PAWN, PAWN_1, NO_PAWN]
  ] as PawnValue[][],
  pawnCount: 9
}
