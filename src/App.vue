<script lang="ts">
import { defineComponent } from "vue";

import Hint from "./components/Hint.vue";
import MemoMenu from "./components/MemoMenu.vue";
import NumericDisplay, { FontStyles } from "./components/NumericDisplay.vue";
import Tile from "./components/Tile.vue";
import TextBox from "./components/TextBox.vue";

import { TileType, TileValue, GameState, HintsType } from "./types";
import { LEVELS } from "./constants";
import {
  distributeTile,
  initializeField,
  randomLevelPreset,
  calculateScale,
  calculateHints,
} from "./utils";

export default defineComponent({
  components: { Hint, MemoMenu, NumericDisplay, TextBox, Tile },
  setup() {
    return { FontStyles };
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
      memoType: null as TileValue | null,
      message: [] as Array<string>,
      // Current level
      score: 0,
      tileCount: 0,
      tiles: [[]] as Array<Array<TileType>>,
      hints: { columns: [], rows: [] } as HintsType,
    };
  },
  created() {
    this.reset();
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize);
  },
  unmounted() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onClick(rowIndex: number, colIndex: number) {
      if (
        this.state !== GameState.PLAYING ||
        this.tiles[rowIndex][colIndex].show
      ) {
        return;
      }

      // Check for memo mode
      if (this.memoType === null) {
        // Show tile
        this.tiles[rowIndex][colIndex].show = true;

        // Check for bomb
        if (this.tiles[rowIndex][colIndex].value === 0) {
          this.changeState(GameState.GAME_OVER);
        } else {
          this.increaseScore(this.tiles[rowIndex][colIndex].value);

          // Check for multiplier
          if (this.tiles[rowIndex][colIndex].value > 1) {
            this.tileCount--;

            // Check for end of level
            if (this.tileCount === 0) {
              this.totalScore += this.score;

              if (this.level === LEVELS.length - 1) {
                this.changeState(GameState.WON_GAME);
              } else {
                this.changeState(GameState.WON_LEVEL);
              }
            }
          }
        }
      } else {
        switch (this.memoType) {
          case TileValue.BOMB:
            this.tiles[rowIndex][colIndex].memoBomb =
              !this.tiles[rowIndex][colIndex].memoBomb;
            break;
          case TileValue.X1:
            this.tiles[rowIndex][colIndex].memo1 =
              !this.tiles[rowIndex][colIndex].memo1;
            break;
          case TileValue.X2:
            this.tiles[rowIndex][colIndex].memo2 =
              !this.tiles[rowIndex][colIndex].memo2;
            break;
          case TileValue.X3:
            this.tiles[rowIndex][colIndex].memo3 =
              !this.tiles[rowIndex][colIndex].memo3;
            break;
        }
      }
    },
    onClose() {
      if (this.state === GameState.WON_LEVEL) {
        this.initializeLevel(this.level + 1);
      } else {
        this.reset();
      }
    },
    onResize() {
      this.scale = calculateScale(this.fullPixel);
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
    changeState(state: GameState) {
      this.state = state;
      switch (state) {
        case GameState.GAME_OVER:
          this.message = [
            `You lost the game in level ${this.level + 1} with ${
              this.totalScore
            } points.`,
          ];
          break;
        case GameState.WON_GAME:
          this.message = [
            `You won level ${this.level + 1} with ${this.score} points.`,
            `You won the game with ${this.totalScore} points.`,
          ];
          break;
        case GameState.WON_LEVEL:
          this.message = [
            `You won level ${this.level + 1} with ${this.score} points.`,
          ];
          break;
      }
    },
    increaseScore(multiplier: number) {
      this.score = this.score === 0 ? multiplier : this.score * multiplier;
    },
    initializeLevel(level: number) {
      this.level = level;
      this.score = 0;
      this.state = GameState.PLAYING;

      const preset = randomLevelPreset(this.level);

      // Set amount of x2s and x3s to find before the level is solved
      this.tileCount = preset.x2s + preset.x3s;

      // Initialize tiles
      this.tiles = initializeField(this.tiles, TileValue.X1);
      this.tiles = distributeTile(this.tiles, TileValue.X2, preset.x2s);
      this.tiles = distributeTile(this.tiles, TileValue.X3, preset.x3s);
      this.tiles = distributeTile(this.tiles, TileValue.BOMB, preset.bombs);
      this.hints = calculateHints(this.tiles);
    },
    reset() {
      this.totalScore = 0;
      this.initializeLevel(0);
    },
  },
});
</script>

<template>
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
          :memo-mode="memoType !== null"
          v-bind="tile"
          @click="onClick(rowIndex, colIndex)"
          @contextmenu.prevent="onRightClick(rowIndex, colIndex)"
        />
        <hint v-bind="hints.rows[rowIndex]" />
      </template>
      <hint
        v-for="(n, colIndex) in tiles[0].length"
        :key="colIndex"
        v-bind="hints.columns[colIndex]"
      />
    </div>
    <memo-menu v-model="memoType" />
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

#options {
  position: absolute;
  top: 370px;
  left: 198px;
  display: grid;
  grid-column: auto;
  font-size: 12px;
  line-height: 12px;
  color: rgba(255, 255, 255, 0.6);
}

#options label {
  display: flex;
  align-items: center;
}

#options input[type="checkbox"] {
  transform: scale(70%);
  margin: 0 2px 0 0;
}

input[type="checkbox"] {
  appearance: none;
  background-color: rgba(255, 255, 255, 0.2);
  font: inherit;
  color: rgba(255, 255, 255, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.5);
  display: grid;
  place-content: center;
}

input[type="checkbox"]::before {
  content: "";
  width: 8px;
  height: 8px;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 18px 18px rgba(255, 255, 255, 0.9);
}

input[type="checkbox"]:checked::before {
  transform: scale(1);
}
</style>