<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";

import level0 from "../assets/font_level_0.png";
import level1 from "../assets/font_level_1.png";
import level2 from "../assets/font_level_2.png";
import level3 from "../assets/font_level_3.png";
import level4 from "../assets/font_level_4.png";
import level5 from "../assets/font_level_5.png";
import level6 from "../assets/font_level_6.png";
import level7 from "../assets/font_level_7.png";
import level8 from "../assets/font_level_8.png";
import level9 from "../assets/font_level_9.png";

import score0 from "../assets/font_score_0.png";
import score1 from "../assets/font_score_1.png";
import score2 from "../assets/font_score_2.png";
import score3 from "../assets/font_score_3.png";
import score4 from "../assets/font_score_4.png";
import score5 from "../assets/font_score_5.png";
import score6 from "../assets/font_score_6.png";
import score7 from "../assets/font_score_7.png";
import score8 from "../assets/font_score_8.png";
import score9 from "../assets/font_score_9.png";

import tile0 from "../assets/font_tile_0.png";
import tile1 from "../assets/font_tile_1.png";
import tile2 from "../assets/font_tile_2.png";
import tile3 from "../assets/font_tile_3.png";
import tile4 from "../assets/font_tile_4.png";
import tile5 from "../assets/font_tile_5.png";
import tile6 from "../assets/font_tile_6.png";
import tile7 from "../assets/font_tile_7.png";
import tile8 from "../assets/font_tile_8.png";
import tile9 from "../assets/font_tile_9.png";

export interface FontType {
  width: number;
  height: number;
  digits: Array<string>;
}

export const FontStyles = {
  LEVEL: {
    width: 6,
    height: 10,
    digits: [
      level0,
      level1,
      level2,
      level3,
      level4,
      level5,
      level6,
      level7,
      level8,
      level9,
    ],
  } as FontType,
  SCORE: {
    width: 14,
    height: 22,
    digits: [
      score0,
      score1,
      score2,
      score3,
      score4,
      score5,
      score6,
      score7,
      score8,
      score9,
    ],
  } as FontType,
  TILE: {
    width: 6,
    height: 8,
    digits: [
      tile0,
      tile1,
      tile2,
      tile3,
      tile4,
      tile5,
      tile6,
      tile7,
      tile8,
      tile9,
    ],
  } as FontType,
} as const;

export default defineComponent({
  props: {
    value: {
      type: Number,
      required: true,
    },
    digits: {
      type: Number,
      default: null,
    },
    fontStyle: {
      type: Object as PropType<FontType>,
      required: true,
    },
  },
  computed: {
    digitsParsed() {
      return String(this.value)
        .padStart(
          this.digits !== null ? this.digits : Math.ceil(this.value / 10),
          "0"
        )
        .split("")
        .map((digit) => {
          return this.fontStyle.digits[parseInt(digit)];
        });
    },
  },
});
</script>

<template>
  <div class="numeric-display">
    <img v-for="(path, index) in digitsParsed" :key="index" :src="path" />
  </div>
</template>

<style scoped>
.numeric-display {
  line-height: 0;
}
img {
  margin-left: 1px;
}
</style>
