<template>
  <VaInput v-model="searchValue" class="mb-4" placeholder="Search">
    <template #appendInner>
      <VaIcon color="secondary" name="mso-search" />
    </template>
  </VaInput>

  <section
    v-if="filteredCategories.length"
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5"
  >
    <div
      v-for="category in filteredCategories"
      :key="category.id"
      class="w-full"
    >
      <VaCard class="w-full">
        <VaCardContent class="text-sm">
          <div class="aspect-w-16 aspect-h-9 mb-2">
            <iframe
              class="w-full h-48 md:h-52 lg:h-56"
              :src="getYoutubeEmbedUrl(category.link)"
              frameborder="0"
              allowfullscreen
            />
          </div>
          <h2 class="text-primary text-base font-semibold">
            {{ category.name }}
          </h2>
        </VaCardContent>
      </VaCard>
    </div>
  </section>

  <VaAlert v-else class="mb-4 leading-5" color="info" outline>
    No matches found. Try refining your search or browse through the videos.
  </VaAlert>
</template>

<script setup lang="ts">
import categories from '../data/popularCategories.json'
import { ref, computed } from 'vue'

const searchValue = ref('')

const filteredCategories = computed(() => {
  const value = searchValue.value.trim().toLowerCase()
  if (!value) return categories

  return categories.filter(
    (category) =>
      category.name.toLowerCase().includes(value) ||
      category.link.toLowerCase().includes(value)
  )
})

function getYoutubeEmbedUrl(url: string) {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/
  )
  return match
    ? `https://www.youtube.com/embed/${match[1]}`
    : 'https://www.youtube.com/embed/'
}
</script>
