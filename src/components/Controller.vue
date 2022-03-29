<template>
  <div class="controller">
    <input type="range" v-for="item in data" onchange="onChange(item)" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps({
  data: Array,
});

const { data } = props;

const onChange = (e: any, item: any) => {
  console.log(e, item);
};
</script>
