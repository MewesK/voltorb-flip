import { LevelPreset } from "./types";

export const SIZE = 5;
export const MAX_TRIES = 1000;
export const LEVELS = [
  [
    { x2s: 3, x3s: 1, bombs: 6 },
    { x2s: 0, x3s: 3, bombs: 6 },
    { x2s: 5, x3s: 0, bombs: 6 },
    { x2s: 2, x3s: 2, bombs: 6 },
    { x2s: 4, x3s: 1, bombs: 6 },
  ],
  [
    { x2s: 1, x3s: 3, bombs: 7 },
    { x2s: 6, x3s: 0, bombs: 7 },
    { x2s: 3, x3s: 2, bombs: 7 },
    { x2s: 0, x3s: 4, bombs: 7 },
    { x2s: 5, x3s: 1, bombs: 7 },
  ],
  [
    { x2s: 2, x3s: 3, bombs: 8 },
    { x2s: 7, x3s: 0, bombs: 8 },
    { x2s: 4, x3s: 2, bombs: 8 },
    { x2s: 1, x3s: 4, bombs: 8 },
    { x2s: 6, x3s: 1, bombs: 8 },
  ],
  [
    { x2s: 3, x3s: 3, bombs: 8 },
    { x2s: 0, x3s: 5, bombs: 8 },
    { x2s: 8, x3s: 0, bombs: 10 },
    { x2s: 5, x3s: 2, bombs: 10 },
    { x2s: 2, x3s: 4, bombs: 10 },
  ],
  [
    { x2s: 7, x3s: 1, bombs: 10 },
    { x2s: 4, x3s: 3, bombs: 10 },
    { x2s: 1, x3s: 5, bombs: 10 },
    { x2s: 9, x3s: 0, bombs: 10 },
    { x2s: 6, x3s: 2, bombs: 10 },
  ],
  [
    { x2s: 3, x3s: 4, bombs: 10 },
    { x2s: 0, x3s: 6, bombs: 10 },
    { x2s: 8, x3s: 1, bombs: 10 },
    { x2s: 5, x3s: 3, bombs: 10 },
    { x2s: 2, x3s: 5, bombs: 10 },
  ],
  [
    { x2s: 7, x3s: 2, bombs: 10 },
    { x2s: 4, x3s: 4, bombs: 10 },
    { x2s: 1, x3s: 6, bombs: 13 },
    { x2s: 9, x3s: 1, bombs: 13 },
    { x2s: 6, x3s: 3, bombs: 10 },
  ],
  [
    { x2s: 0, x3s: 7, bombs: 10 },
    { x2s: 8, x3s: 2, bombs: 10 },
    { x2s: 5, x3s: 4, bombs: 10 },
    { x2s: 2, x3s: 6, bombs: 10 },
    { x2s: 7, x3s: 3, bombs: 10 },
  ],
] as Array<Array<LevelPreset>>;
