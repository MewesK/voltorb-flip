<script lang="ts">
import { defineComponent } from "vue";

import Hint from "./components/Hint.vue";
import NumericDisplay, { FontStyles } from "./components/NumericDisplay.vue";
import Tile from "./components/Tile.vue";
import TextBox from "./components/TextBox.vue";

import { TileType, TileValue, GameState } from "./types";
import { LEVELS } from "./constants";
import {
  distributeTile,
  initializeField,
  randomLevelPreset,
  bombsinColumn,
  bombsInRow,
  sumInColumn,
  sumInRow,
  calculateScale,
} from "./utils";

export default defineComponent({
  components: { Hint, NumericDisplay, TextBox, Tile },
  setup() {
    return {
      FontStyles,
      bombsinColumn,
      bombsInRow,
      sumInColumn,
      sumInRow,
      calculateScale,
    };
  },
  data() {
    return {
      // Options
      scale: 1,
      smooth: false,
      fullPixel: false,
      // Current game
      level: 0,
      totalScore: 0,
      state: GameState.PLAYING,
      message: [] as Array<string>,
      // Current level
      score: 0,
      tileCount: 0,
      tiles: [[]] as Array<Array<TileType>>,
    };
  },
  created() {
    this.reset();
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
      if (this.state !== GameState.PLAYING || this.tiles[rowIndex][colIndex].show) {
        return;
      }

      // Show tile
      this.tiles[rowIndex][colIndex].show = true;

      if (this.tiles[rowIndex][colIndex].value === 0) {
        // Game over
        this.state = GameState.GAME_OVER;
        this.message = [
          `You lost the game in level ${this.level + 1} with ${
            this.totalScore
          } points.`,
        ];
      } else {
        // Increase score
        this.increaseScore(this.tiles[rowIndex][colIndex].value);

        if (this.tiles[rowIndex][colIndex].value > 1) {
          this.tileCount--;

          // Won level
          if (this.tileCount === 0) {
            this.totalScore += this.score;
            this.state = GameState.WON_LEVEL;
            this.message = [
              `You won level ${this.level + 1} with ${this.score} points.`,
            ];

            if (this.level === LEVELS.length - 1) {
              // Won game
              this.state = GameState.WON_GAME;
              this.message.push(
                `You won the game with ${this.totalScore} points.`
              );
            }
          }
        }
      }
    },
    onClose() {
      if (this.state === GameState.WON_LEVEL) {
        // Next level
        this.initializeLevel(this.level + 1);
      } else {
        // Reset
        this.reset();
      }
    },
    onRightClick(rowIndex: number, colIndex: number) {
      if (this.state !== GameState.PLAYING) {
        return;
      }

      if (!this.tiles[rowIndex][colIndex].show) {
        this.tiles[rowIndex][colIndex].memoBomb =
          !this.tiles[rowIndex][colIndex].memoBomb;
      }
    },
    onResize() {
      this.scale = calculateScale(this.fullPixel);
    },
    initializeLevel(level: number) {
      this.level = level;
      this.score = 0;
      this.state = GameState.PLAYING;

      const preset = randomLevelPreset(this.tiles, this.level);

      // Set amount of x2s and x3s to find before the level is solved
      this.tileCount = preset.x2s + preset.x3s;

      // Initialize tiles
      this.tiles = initializeField(this.tiles, TileValue.X1);
      this.tiles = distributeTile(this.tiles, TileValue.X2, preset.x2s);
      this.tiles = distributeTile(this.tiles, TileValue.X3, preset.x3s);
      this.tiles = distributeTile(this.tiles, TileValue.BOMB, preset.bombs);
    },
    increaseScore(multiplier: number) {
      this.score = this.score === 0 ? multiplier : this.score * multiplier;
    },
    reset() {
      this.totalScore = 0;
      this.initializeLevel(0);
    },
  },
});
</script>

<template>
  <div id="options">
    <label id="option-smooth">
      <input v-model="smooth" type="checkbox" :disabled="fullPixel" />
      Smooth
    </label>
    <label id="option-full-pixel">
      <input v-model="fullPixel" type="checkbox" @change="onResize" />
      Full Pixel
    </label>
  </div>
  <div
    id="field"
    :class="{ pixelated: fullPixel || !smooth }"
    :style="{ transform: `scale(${scale})` }"
  >
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
    <div id="tiles" @contextmenu.prevent>
      <template v-for="(row, rowIndex) in tiles" :key="rowIndex">
        <tile
          v-for="(tile, colIndex) in row"
          :key="colIndex"
          v-bind="tile"
          @click="onClick(rowIndex, colIndex)"
          @contextmenu.prevent="onRightClick(rowIndex, colIndex)"
        />
        <hint
          :bombs="bombsInRow(tiles, rowIndex)"
          :sum="sumInRow(tiles, rowIndex)"
        />
      </template>
      <hint
        v-for="(n, colIndex) in tiles[0].length"
        :key="colIndex"
        :bombs="bombsinColumn(tiles, colIndex)"
        :sum="sumInColumn(tiles, colIndex)"
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
    <text-box :pages="message" @close="onClose" />
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
  transform-origin: center 0;
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

.pixelated {
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

#options {
  position: absolute;
  top: 10px;
  left: 10px;
  display: grid;
  grid-column: auto;
}
</style>
