<script lang="ts">
import { defineComponent } from 'vue'

import Hint from './components/Hint.vue'
import NumberDisplay, { Types } from './components/NumberDisplay.vue'
import Tile from './components/Tile.vue'

// ×2s, ×3s, Voltorb, Coins
const LEVEL_DATA = [
  [
    [3, 1, 6, 24],
    [0, 3, 6, 27],
    [5, 0, 6, 32],
    [2, 2, 6, 36],
    [4, 1, 6, 48],
  ],
  [
    [1, 3, 7, 54],
    [6, 0, 7, 64],
    [3, 2, 7, 72],
    [0, 4, 7, 81],
    [5, 1, 7, 96],
  ],
  [
    [2, 3, 8, 108],
    [7, 0, 8, 128],
    [4, 2, 8, 144],
    [1, 4, 8, 162],
    [6, 1, 8, 192],
  ],
  [
    [3, 3, 8, 216],
    [0, 5, 8, 243],
    [8, 0, 10, 256],
    [5, 2, 10, 288],
    [2, 4, 10, 324],
  ],
  [
    [7, 1, 10, 384],
    [4, 3, 10, 432],
    [1, 5, 10, 486],
    [9, 0, 10, 512],
    [6, 2, 10, 576],
  ],
  [
    [3, 4, 10, 648],
    [0, 6, 10, 729],
    [8, 1, 10, 768],
    [5, 3, 10, 864],
    [2, 5, 10, 972],
  ],
  [
    [7, 2, 10, 1152],
    [4, 4, 10, 1296],
    [1, 6, 13, 1458],
    [9, 1, 13, 1536],
    [6, 3, 10, 1728],
  ],
  [
    [0, 7, 10, 2187],
    [8, 2, 10, 2304],
    [5, 4, 10, 2592],
    [2, 6, 10, 2916],
    [7, 3, 10, 3456],
  ],
]

export default defineComponent({
  components: { Hint, NumberDisplay, Tile },
  setup() {
    return { Types }
  },
  data() {
    return {
      level: 1,
      totalScore: 0,
      zoom: 2,
      // Current
      score: 0,
      tiles: [
        [1, 3, 1, 0, 0],
        [1, 2, 0, 3, 3],
        [0, 0, 1, 2, 0],
        [2, 0, 2, 0, 1],
        [1, 0, 0, 2, 3],
      ],
    }
  },
})
</script>

<template>
  <div id="field" :style="{ transform: `scale(${zoom})` }">
    <number-display id="number-level" :value="level" :type="Types.LEVEL" />
    <number-display
      id="number-total-score"
      :value="totalScore"
      :digits="5"
      :type="Types.SCORE"
    />
    <number-display id="number-score" :value="score" :digits="5" :type="Types.SCORE" />
    <div id="tiles">
      <template
        v-for="(row, rowIndex) in tiles"
        :key="rowIndex"
      >
        <tile
          v-for="(tile, colIndex) in row"
          :key="colIndex"
          :value="tile"
        />
        <hint :bombs="0" :sum="5" />
      </template>
      <hint
        v-for="(n, index) in tiles[0].length"
        :key="index"
        :bombs="0"
        :sum="5"
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
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

#number-level {
  position: absolute;
  top: 15px;
  left: 170px;
}

#number-total-score {
  position: absolute;
  top: 127px;
  left: 175px;
}

#number-score {
  position: absolute;
  top: 167px;
  left: 175px;
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
</style>
