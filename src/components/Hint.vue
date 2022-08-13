<script lang="ts">
import { defineComponent } from 'vue'
import NumberDisplay, { Types } from './NumberDisplay.vue'

export default defineComponent({
  components: { NumberDisplay },
  props: {
    bombs: {
      type: Number,
      required: true,
    },
    sum: {
      type: Number,
      required: true,
    },
  },
  setup() {
    return { Types }
  },
})
</script>

<template>
  <div class="hint">
    <number-display
      class="number-sum"
      :value="5"
      :digits="2"
      :type="Types.TILE"
    />
    <number-display
      class="number-bombs"
      :value="1"
      :digits="1"
      :type="Types.TILE"
    />
  </div>
</template>

<style scoped>
.hint {
}

.number-sum, .number-bombs {
  display: flex;
  justify-content: end;
  padding-right: 1px;
}

.number-bombs {
  margin-top: 5px;
}
</style>
