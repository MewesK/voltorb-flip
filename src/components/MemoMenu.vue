<script lang="ts">
import { defineComponent, PropType } from "vue";
import { TileValue } from "../types";

import memoOpen from "../assets/memo_open.png";
import memoClose from "../assets/memo_close.png";
import memo1On from "../assets/memo_1_on.png";
import memo1Off from "../assets/memo_1_off.png";
import memo2On from "../assets/memo_2_on.png";
import memo2Off from "../assets/memo_2_off.png";
import memo3On from "../assets/memo_3_on.png";
import memo3Off from "../assets/memo_3_off.png";
import memoBombOn from "../assets/memo_bomb_on.png";
import memoBombOff from "../assets/memo_bomb_off.png";

export default defineComponent({
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Number as PropType<TileValue | null>,
      default: null,
    },
  },
  setup() {
    return {
      memoOpen,
      memoClose,
      memo1On,
      memo1Off,
      memo2On,
      memo2Off,
      memo3On,
      memo3Off,
      memoBombOn,
      memoBombOff,
      TileValue,
    };
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    onChange(value: TileValue | null) {
      this.$emit("update:modelValue", value);
    },
  },
});
</script>

<template>
  <div class="memo">
    <div class="memo-toggle">
      <img
        :src="open ? memoClose : memoOpen"
        @click="
          open = !open;
          onChange(open ? TileValue.BOMB : null);
        "
      />
    </div>
    <div v-if="open" class="memo-menu">
      <img
        :src="modelValue === TileValue.BOMB ? memoBombOn : memoBombOff"
        @click="onChange(TileValue.BOMB)"
      />
      <img
        :src="modelValue === TileValue.X1 ? memo1On : memo1Off"
        @click="onChange(TileValue.X1)"
      />
      <img
        :src="modelValue === TileValue.X2 ? memo2On : memo2Off"
        @click="onChange(TileValue.X2)"
      />
      <img
        :src="modelValue === TileValue.X3 ? memo3On : memo3Off"
        @click="onChange(TileValue.X3)"
      />
    </div>
  </div>
</template>

<style scoped>
.memo {
  position: absolute;
  right: 5px;
  top: 209px;
}
.memo-menu {
  box-sizing: border-box;
  background-image: url("../assets/memo_menu.png");
  width: 54px;
  height: 78px;
  display: grid;
  grid-template-rows: repeat(2, 24px);
  grid-template-columns: repeat(2, 24px);
  padding: 3px;
}
</style>
