<script lang="ts">
import { defineComponent } from "vue";

import tile1 from "../assets/tile_1.png";
import tile2 from "../assets/tile_2.png";
import tile3 from "../assets/tile_3.png";
import tileBomb from "../assets/tile_bomb.png";

export default defineComponent({
  props: {
    value: {
      type: Number,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
    memoBomb: {
      type: Boolean,
      default: false,
    },
    memo1: {
      type: Boolean,
      default: false,
    },
    memo2: {
      type: Boolean,
      default: false,
    },
    memo3: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    path() {
      switch (this.value) { 
        case 1:
          return tile1;
        case 2:
          return tile2;
        case 3:
          return tile3;
        default:
          return tileBomb;
      }
    }
  },
});
</script>

<template>
  <div :class="{ tile: true, show }">
    <div class="tile-inner">
      <div class="tile-inner-front">
        <img src="../assets/tile_hidden.png" />
      </div>
      <div class="tile-inner-back">
        <img :src="path" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tile {
  line-height: 0;
}
.tile-inner {
  transition: transform 0.5s;
  transform-style: preserve-3d;
}
.tile.show .tile-inner, .tile-inner-back {
  transform: rotateY(180deg);
}
.tile-inner-front, .tile-inner-back {
  position: absolute;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}
</style>
