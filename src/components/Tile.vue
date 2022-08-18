<script lang="ts">
import { defineComponent, PropType } from "vue";

import { TileValue } from "../types";

import tile1 from "../assets/tile_1.png";
import tile2 from "../assets/tile_2.png";
import tile3 from "../assets/tile_3.png";
import tileBomb from "../assets/tile_bomb.png";

export default defineComponent({
  props: {
    value: {
      type: Number as PropType<TileValue>,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
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
    memoBomb: {
      type: Boolean,
      default: false,
    },
  },
  data() { 
    return {
      selected: false,
    };
  },
  computed: {
    path() {
      switch (this.value) {
        case TileValue.X1:
          return tile1;
        case TileValue.X2:
          return tile2;
        case TileValue.X3:
          return tile3;
        default:
          return tileBomb;
      }
    },
  },
});
</script>

<template>
  <div
    :class="{ tile: true, show }"
    @mouseover="selected = true"
    @mouseleave="selected = false"
  >
    <div class="tile-inner">
      <div class="tile-inner-front">
        <img src="../assets/tile_back.png" />
        <transition-group name="fade">
          <img v-if="memo1" src="../assets/tile_memo_1.png" />
          <img v-if="memo2" src="../assets/tile_memo_2.png" />
          <img v-if="memo3" src="../assets/tile_memo_3.png" />
          <img v-if="memoBomb" src="../assets/tile_memo_bomb.png" />
        </transition-group>
      </div>
      <div class="tile-inner-back">
        <img :src="path" />
      </div>
    </div>
    <transition name="fade">
      <img
        v-if="selected"
        class="tile-cursor"
        src="../assets/cursor.png"
      />
    </transition>
  </div>
</template>

<style scoped>
.tile {
  cursor: pointer;
  line-height: 0;
}

/* Flip */

.tile-inner {
  transition: transform 0.2s;
  transform-style: preserve-3d;
}
.tile.show .tile-inner,
.tile-inner-back {
  transform: rotateY(180deg);
}
.tile-inner-front,
.tile-inner-back {
  position: absolute;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}
.tile-inner-front img {
  position: absolute;
}

/* Cursor */

.tile-cursor {
  position: relative;
  top: -2px;
  left: -2px;
}

/* Transition */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
