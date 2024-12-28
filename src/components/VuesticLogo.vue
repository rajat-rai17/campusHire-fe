<template>
  <img
    :src="logoSrc"
    :height="finalHeight"
    :width="finalWidth"
    alt="Campus Hire Logo"
    style="object-fit: contain;"
  />
</template>

<script lang="ts" setup>
import { withDefaults, defineProps } from 'vue'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    logoSrc: string
  }>(),
  {
    logoSrc: './public/logo.png', // Update with the actual path to your PNG file
  },
)
const finalHeight = 5
const finalWidth = computed(() => (finalHeight * 478) / 57)
</script>
