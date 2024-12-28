<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
    <div class="about">
      <h1>Sign Up</h1>
    </div>
    <div>
      <Button>Sign Up</Button>
    </div>
  </template>
  
  <style>
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
  </style>
  