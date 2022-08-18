import { LEVELS, MAX_TRIES, SIZE } from "./constants";
import { LevelPreset, TileType, TileValue } from "./types";

/**
 * Distributes a tile value randomly on the field.
 */
export function distributeTile(
  tiles: Array<Array<TileType>>,
  value: TileValue,
  amount: number
): Array<Array<TileType>> {
  for (let i = 0; i < amount; i++) {
    // Max tries
    for (let count = 0; count < MAX_TRIES; count++) {
      const rowIndex = Math.round(Math.random() * (SIZE - 1));
      const colIndex = Math.round(Math.random() * (SIZE - 1));
      // Check if tile is valid
      if (tiles[rowIndex][colIndex].value === TileValue.X1) {
        tiles[rowIndex][colIndex].value = value;
        break;
      }
      // Check if max tries are exceeded
      if (count === MAX_TRIES - 1) {
        console.error("Max tries exceeded. Cannot initialize level.");
      }
    }
  }
  return tiles;
}

/**
 * Initializes the field with the given tile value.
 */
export function initializeField(
  tiles: Array<Array<TileType>>,
  value: TileValue
): Array<Array<TileType>> {
  for (let rowIndex = 0; rowIndex < SIZE; rowIndex++) {
    tiles[rowIndex] = [];
    for (let colIndex = 0; colIndex < SIZE; colIndex++) {
      tiles[rowIndex][colIndex] = {
        value: value,
        show: false,
        memoBomb: false,
        memo1: false,
        memo2: false,
        memo3: false,
      } as TileType;
    }
  }
  return tiles;
}

export function randomLevelPreset(
  tiles: Array<Array<TileType>>,
  level: number
): LevelPreset {
  return LEVELS[level][Math.round(Math.random() * (LEVELS[level].length - 1))];
}

export function bombsinColumn(
  tiles: Array<Array<TileType>>,
  colIndex: number
): number {
  return tiles.reduce(
    (previousValue: number, currentValue: Array<TileType>) =>
      previousValue + (currentValue[colIndex].value === 0 ? 1 : 0),
    0
  );
}

export function bombsInRow(
  tiles: Array<Array<TileType>>,
  rowIndex: number
): number {
  return tiles[rowIndex].reduce(
    (previousValue: number, currentValue: TileType) =>
      previousValue + (currentValue.value === 0 ? 1 : 0),
    0
  );
}

export function sumInColumn(
  tiles: Array<Array<TileType>>,
  colIndex: number
): number {
  return tiles.reduce(
    (previousValue: number, currentValue: Array<TileType>) =>
      previousValue + currentValue[colIndex].value,
    0
  );
}

export function sumInRow(
  tiles: Array<Array<TileType>>,
  rowIndex: number
): number {
  return tiles[rowIndex].reduce(
    (previousValue: number, currentValue: TileType) =>
      previousValue + currentValue.value,
    0
  );
}

export function calculateScale(fullPixel: boolean): number {
  return Math.max(
    fullPixel
      ? Math.min(
          Math.floor(document.documentElement.clientHeight / 400),
          Math.floor(document.documentElement.clientWidth / 256)
        )
      : Math.min(
          Math.floor((document.documentElement.clientHeight * 100) / 400) / 100,
          Math.floor((document.documentElement.clientWidth * 100) / 256) / 100
        ),
    1
  );
}
