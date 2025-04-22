<template>
  <VaAvatar size="large" color="warning"><span class="text-4xl"> 😍 </span></VaAvatar>
  <div class="flex flex-col justify-center">
    <h2 class="text-[28px] md:text-[32px] leading-10 font-bold">{{ userName }}</h2>
    <div class="flex space-x-1 text-[13px] leading-4">
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '../../../stores/user-store'

const store = useUserStore()
const userRaw = localStorage.getItem('user')
const user = userRaw ? JSON.parse(userRaw) : null
const userName = ref(user?.name || 'Guest')
</script>
