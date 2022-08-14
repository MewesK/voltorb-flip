<script lang="ts">
import { defineComponent } from "vue";
import NumericDisplay, { FontStyles } from "./NumericDisplay.vue";

export default defineComponent({
  components: { NumericDisplay },
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
    return { FontStyles };
  },
});
</script>

<template>
  <div class="hint">
    <numeric-display
      class="number-sum"
      :value="sum"
      :digits="2"
      :font-style="FontStyles.TILE"
    />
    <numeric-display
      class="number-bombs"
      :value="bombs"
      :digits="1"
      :font-style="FontStyles.TILE"
    />
  </div>
</template>

<style scoped>
.number-sum,
.number-bombs {
  display: flex;
  justify-content: end;
  padding-right: 1px;
}

.number-bombs {
  margin-top: 5px;
}
</style>
