<script lang="ts">
import { defineComponent } from "vue";

import Hint from "./components/Hint.vue";
import NumericDisplay, { FontStyles } from "./components/NumericDisplay.vue";
import Tile from "./components/Tile.vue";

export interface TileType {
  value: number;
  show: boolean;
  memoBomb: boolean;
  memo1: boolean;
  memo2: boolean;
  memo3: boolean;
}

const SIZE = 5;
const MAX_TRIES = 1000;

// ×2s, ×3s, Voltorb
const LEVEL_DATA = [
  [
    [3, 1, 6],
    [0, 3, 6],
    [5, 0, 6],
    [2, 2, 6],
    [4, 1, 6],
  ],
  [
    [1, 3, 7],
    [6, 0, 7],
    [3, 2, 7],
    [0, 4, 7],
    [5, 1, 7],
  ],
  [
    [2, 3, 8],
    [7, 0, 8],
    [4, 2, 8],
    [1, 4, 8],
    [6, 1, 8],
  ],
  [
    [3, 3, 8],
    [0, 5, 8],
    [8, 0, 10],
    [5, 2, 10],
    [2, 4, 10],
  ],
  [
    [7, 1, 10],
    [4, 3, 10],
    [1, 5, 10],
    [9, 0, 10],
    [6, 2, 10],
  ],
  [
    [3, 4, 10],
    [0, 6, 10],
    [8, 1, 10],
    [5, 3, 10],
    [2, 5, 10],
  ],
  [
    [7, 2, 10],
    [4, 4, 10],
    [1, 6, 13],
    [9, 1, 13],
    [6, 3, 10],
  ],
  [
    [0, 7, 10],
    [8, 2, 10],
    [5, 4, 10],
    [2, 6, 10],
    [7, 3, 10],
  ],
] as Array<Array<Array<number>>>;

export default defineComponent({
  components: { Hint, NumericDisplay, Tile },
  setup() {
    return { FontStyles };
  },
  data() {
    return {
      level: 0,
      totalScore: 0,
      zoom: 1,
      // Current
      score: 0,
      tileCount: 0,
      tiles: [[]] as Array<Array<TileType>>,
    };
  },
  created() {
    this.initializeLevel(0);
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
  },
  unmounted() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onClick(rowIndex: number, colIndex: number) {
      if (this.tileCount === 0) {
        return;
      }

      // Show tile
      this.tiles[rowIndex][colIndex].show = true;

      if (this.tiles[rowIndex][colIndex].value === 0) {
        // Game over
        console.log(
          `You lost the game in level ${this.level + 1} with ${
            this.totalScore
          } points.`
        );

        // Reset
        this.reset();
      } else {
        // Increase score
        this.increaseScore(this.tiles[rowIndex][colIndex].value);

        if (this.tiles[rowIndex][colIndex].value > 1) {
          this.tileCount--;
          if (this.tileCount === 0) {
            // Won level
            this.totalScore += this.score;
            console.log(
              `You won level ${this.level + 1} with ${this.score} points.`
            );

            if (this.level === LEVEL_DATA.length - 1) {
              // Won game
              console.log(`You won the game with ${this.totalScore} points.`);

              // Reset
              this.reset();
            } else {
              this.initializeLevel(this.level + 1);
            }
          }
        }
      }
    },
    onRightClick(rowIndex: number, colIndex: number) {
      if (this.tileCount === 0) {
        return;
      }

      if (!this.tiles[rowIndex][colIndex].show) {
        this.tiles[rowIndex][colIndex].memoBomb =
          !this.tiles[rowIndex][colIndex].memoBomb;
      }
    },
    onResize() {
      this.zoom = Math.max(
        Math.min(
          Math.floor((document.documentElement.clientHeight * 10) / 400) * 10,
          Math.floor((document.documentElement.clientWidth * 10) / 256) * 10
        ),
        100
      );
    },
    initializeLevel(level: number) {
      this.level = level;
      this.score = 0;

      const preset = [
        ...LEVEL_DATA[this.level][
          Math.round(Math.random() * (LEVEL_DATA[this.level].length - 1))
        ],
      ];

      // Set amount of x2s and x3s to find before the level is solved
      this.tileCount = preset[0] + preset[1];

      // Initialize tiles
      this.tiles = [];
      for (let rowIndex = 0; rowIndex < SIZE; rowIndex++) {
        this.tiles[rowIndex] = [];
        for (let colIndex = 0; colIndex < SIZE; colIndex++) {
          this.tiles[rowIndex][colIndex] = {
            value: 1,
            show: false,
            memoBomb: false,
            memo1: false,
            memo2: false,
            memo3: false,
          } as TileType;
        }
      }

      const initializeValue = (value: number, amount: number) => {
        for (let i = 0; i < amount; i++) {
          // Max tries
          for (let count = 0; count < MAX_TRIES; count++) {
            const rowIndex = Math.round(Math.random() * (SIZE - 1));
            const colIndex = Math.round(Math.random() * (SIZE - 1));
            if (this.tiles[rowIndex][colIndex].value === 1) {
              this.tiles[rowIndex][colIndex].value = value;
              break;
            }
            if (count === MAX_TRIES - 1) {
              console.error("Max tries exceeded. Cannot initialize level.");
            }
          }
        }
      };

      // Set x2s randomly
      initializeValue(2, preset[0]);

      // Set x3s randomly
      initializeValue(3, preset[1]);

      // Set bombs randomly
      initializeValue(0, preset[2]);
    },
    increaseScore(multiplier: number) {
      this.score = this.score === 0 ? multiplier : this.score * multiplier;
    },
    bombsRow(rowIndex: number) {
      return this.tiles[rowIndex].reduce(
        (previousValue: number, currentValue: TileType) =>
          previousValue + (currentValue.value === 0 ? 1 : 0),
        0
      );
    },
    sumRow(rowIndex: number) {
      return this.tiles[rowIndex].reduce(
        (previousValue: number, currentValue: TileType) =>
          previousValue + currentValue.value,
        0
      );
    },
    bombsCol(colIndex: number) {
      return this.tiles.reduce(
        (previousValue: number, currentValue: Array<TileType>) =>
          previousValue + (currentValue[colIndex].value === 0 ? 1 : 0),
        0
      );
    },
    sumCol(colIndex: number) {
      return this.tiles.reduce(
        (previousValue: number, currentValue: Array<TileType>) =>
          previousValue + currentValue[colIndex].value,
        0
      );
    },
    reset() {
      setTimeout(() => {
        this.totalScore = 0;
        this.initializeLevel(0);
      }, 1000);
    },
  },
});
</script>

<template>
  <div id="field" class="pixelated" :style="{ zoom: `${zoom}%` }">
    <numeric-display
      id="number-level"
      :value="level + 1"
      :font-style="FontStyles.LEVEL"
    />
    <numeric-display
      id="number-total-score"
      :value="totalScore"
      :digits="5"
      :font-style="FontStyles.SCORE"
    />
    <numeric-display
      id="number-score"
      :value="score"
      :digits="5"
      :font-style="FontStyles.SCORE"
    />
    <div id="tiles">
      <template v-for="(row, rowIndex) in tiles" :key="rowIndex">
        <tile
          v-for="(tile, colIndex) in row"
          :key="colIndex"
          v-bind="tile"
          @click="onClick(rowIndex, colIndex)"
          @contextmenu.prevent="onRightClick(rowIndex, colIndex)"
        />
        <hint :bombs="bombsRow(rowIndex)" :sum="sumRow(rowIndex)" />
      </template>
      <hint
        v-for="(n, colIndex) in tiles[0].length"
        :key="colIndex"
        :bombs="bombsCol(colIndex)"
        :sum="sumCol(colIndex)"
      />
    </div>
    <div id="memo">
      <div id="memo-toggle" />
      <div id="memo-menu">
        <div id="memo-button-bomb" />
        <div id="memo-button-1" />
        <div id="memo-button-2" />
        <div id="memo-button-3" />
        <div />
      </div>
    </div>
  </div>
</template>

<style scoped>
#field {
  position: relative;
  width: 256px;
  height: 400px;
  background-image: url("./assets/field.png");
  margin: 0;
  padding: 0;
  text-align: initial;
}

#number-level {
  position: absolute;
  top: 15px;
  left: 169px;
}

#number-total-score {
  position: absolute;
  top: 127px;
  left: 170px;
}

#number-score {
  position: absolute;
  top: 167px;
  left: 170px;
}

#tiles {
  position: absolute;
  top: 208px;
  left: 8px;
  display: grid;
  grid-template-rows: repeat(6, 24px);
  grid-template-columns: repeat(6, 24px);
  gap: 8px;
}

@media (min-width: 512px) {
  #field {
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }
}
</style>
