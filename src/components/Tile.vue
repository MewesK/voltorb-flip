<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: Number,
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
})
</script>

<template>
  <div class="tile" />
</template>

<style scoped>
.tile {
}
</style>
