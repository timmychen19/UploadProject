<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="translate-y-4 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-4 opacity-0"
  >
    <div
      v-if="images.length > 0 && isOpen"
      class="fixed bottom-6 right-6 w-72 bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-4 border border-slate-200 z-50"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">
          🖼️ 提取圖片 ({{ images.length }})
        </h3>
        <button
          @click="isOpen = false"
          class="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Image Grid -->
      <div class="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto scrollbar-thin">
        <div
          v-for="(img, idx) in images"
          :key="idx"
          class="overflow-hidden rounded-lg aspect-square bg-slate-100 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
          @click="$emit('select-image', img)"
        >
          <img
            :src="img.url"
            :alt="img.name"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Footer -->
      <p class="text-[10px] text-slate-400 mt-2 text-center">
        點擊圖片插入至 Markdown 編輯器
      </p>
    </div>
  </Transition>

  <!-- Toggle Button (when closed) -->
  <button
    v-if="images.length > 0 && !isOpen"
    @click="isOpen = true"
    class="fixed bottom-6 right-6 w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all z-50"
  >
    <span class="text-xs font-bold">{{ images.length }}</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  images: { type: Array, default: () => [] }, // [{ name, url }]
})

defineEmits(['select-image'])

const isOpen = ref(true)
</script>
