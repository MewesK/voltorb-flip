export interface LevelPreset {
  x2s: number;
  x3s: number;
  bombs: number;
}

export interface TileType {
  value: TileValue;
  show: boolean;
  memoBomb: boolean;
  memo1: boolean;
  memo2: boolean;
  memo3: boolean;
}

export enum TileValue {
  BOMB = 0,
  X1 = 1,
  X2 = 2,
  X3 = 3,
}

export enum GameState {
  PLAYING = 0,
  GAME_OVER = 1,
  WON_LEVEL = 2,
  WON_GAME = 3,
}

