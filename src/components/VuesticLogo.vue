<template>
  <img :src="logoSrc" :style="{ height: height + 'px', width: 'auto', objectFit: 'contain' }" alt="Logo" />
</template>

<script lang="ts" setup>
import { withDefaults, defineProps } from 'vue'

withDefaults(
  defineProps<{
    logoSrc?: string
    height?: number
  }>(),
  {
    logoSrc: '/logo.svg',
    height: 32,
  },
)
</script>
