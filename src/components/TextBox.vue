<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  emits: ['close'],
  props: {
    pages: {
      type: Array as PropType<Array<string>>,
      default: [],
    },
  },
  data() {
    return {
      show: false,
      currentPage: 0,
    };
  },
  methods: {
    onClick() { 
      if (this.pages.length - 1 > this.currentPage) {
        this.currentPage++;
      } else { 
        this.show = false;
        this.$emit('close');
      }
    },
  },
  watch: {
    pages(value: Array<string>) {
      if (value && value.length > 0) {
        this.show = !!value;
      }
    }
  },
});
</script>

<template>
  <transition name="fade">
    <div v-if="show" class="text-box" @click="onClick">
      <div class="text-box-inner">
        <transition name="scroll">
          {{ pages[currentPage] }}
        </transition>
      </div>
      <img
        v-if="pages.length - 1 > currentPage"
        class="text-box-indicator"
        src="../assets/box-indicator.png"
      />
    </div>
  </transition>
</template>

<style scoped>
.text-box {
  box-sizing: border-box;
  position: absolute;
  left: 2px;
  bottom: 7px;
  width: 252px;
  height: 46px;
  background-image: url("../assets/box.png");
  color: rgb(82, 82, 90);
  font-family: 'Nintendo DS BIOS', sans-serif;
  padding: 5px 22px 1px 12px;
  cursor: pointer;
}
.text-box-inner {
  white-space: pre;
  line-height: 1.1em;
}
.text-box-indicator {
  position: absolute;
  right: 5px;
  bottom: 10px;
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

.scroll-enter-active,
.scroll-leave-active {
  transition: all 0.5s ease;
}
.scroll-enter-from,
.scroll-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
