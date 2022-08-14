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
];

export default defineComponent({
  components: { Hint, NumericDisplay, Tile },
  setup() {
    return { FontStyles };
  },
  data() {
    return {
      level: 1,
      totalScore: 0,
      zoom: 1,
      // Current
      score: 0,
      tiles: [
        [
          { value: 1, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 3, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 1, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 0, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 0, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
        ] as Array<TileType>,
        [
          { value: 1, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 2, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 0, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 3, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 3, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
        ] as Array<TileType>,
        [
          { value: 0, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 0, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 1, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 2, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 0, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
        ] as Array<TileType>,
        [
          { value: 2, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 0, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 2, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 0, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 1, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
        ] as Array<TileType>,
        [
          { value: 1, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 0, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 0, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 2, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
          { value: 3, show: false, memoBomb: false, memo1: false, memo2: false, memo3: false } as TileType,
        ] as Array<TileType>,
      ] as Array<Array<TileType>>,
    };
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    onClick(rowIndex: number, colIndex: number) {
      this.tiles[rowIndex][colIndex].show = true;

      if (this.tiles[rowIndex][colIndex].value === 0) {
        console.log('BOMB');
      } else {
        this.increaseScore(this.tiles[rowIndex][colIndex].value);
      }
    },
    onResize() { 
      this.zoom = Math.max(Math.min(Math.floor(document.documentElement.clientHeight * 10 / 400) * 10, Math.floor(document.documentElement.clientWidth * 10 / 256) * 10), 100);
    },
    increaseScore(multiplier: number) {
      this.score = this.score === 0 ? multiplier : this.score * multiplier;
    },
    bombsRow(rowIndex: number) { 
      return this.tiles[rowIndex].reduce((previousValue: number, currentValue: TileType) => previousValue + (currentValue.value === 0 ? 1 : 0), 0);
    },
    sumRow(rowIndex: number) { 
      return this.tiles[rowIndex].reduce((previousValue: number, currentValue: TileType) => previousValue + currentValue.value, 0);
    },
    bombsCol(colIndex: number) { 
      return this.tiles.reduce((previousValue: number, currentValue: Array<TileType>) => previousValue + (currentValue[colIndex].value === 0 ? 1 : 0), 0);
    },
    sumCol(colIndex: number) { 
      return this.tiles.reduce((previousValue: number, currentValue: Array<TileType>) => previousValue + currentValue[colIndex].value, 0);
    },
  },
});
</script>

<template>
  <div id="field" class="pixelated" :style="{ zoom: `${zoom}%` }">
    <numeric-display
      id="number-level"
      :value="level"
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
        <tile v-for="(tile, colIndex) in row" :key="colIndex" v-bind="tile" @click="onClick(rowIndex, colIndex)" />
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
