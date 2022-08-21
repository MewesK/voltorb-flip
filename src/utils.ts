import { LEVELS, MAX_TRIES, SIZE } from "./constants";
import { HintType, LevelPreset, TileType, TileValue } from "./types";

export function calculateHints(tiles: Array<Array<TileType>>): {
  rows: HintType[];
  columns: HintType[];
} {
  const hints = {
    rows: [] as Array<HintType>,
    columns: [] as Array<HintType>,
  };
  for (let index = 0; index < SIZE; index++) {
    hints.columns[index] = { bombs: 0, sum: 0 } as HintType;
    hints.rows[index] = { bombs: 0, sum: 0 } as HintType;
    for (let subIndex = 0; subIndex < SIZE; subIndex++) {
      hints.columns[index].bombs +=
        tiles[subIndex][index].value === TileValue.BOMB ? 1 : 0;
      hints.columns[index].sum += tiles[subIndex][index].value;

      hints.rows[index].bombs +=
        tiles[index][subIndex].value === TileValue.BOMB ? 1 : 0;
      hints.rows[index].sum += tiles[index][subIndex].value;
    }
  }
  return hints;
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

export function randomLevelPreset(level: number): LevelPreset {
  return LEVELS[level][Math.round(Math.random() * (LEVELS[level].length - 1))];
}
