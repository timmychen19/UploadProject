<template>
  <div class="h-full flex flex-col p-6 overflow-y-auto scrollbar-thin">
    <h2 class="text-xl font-bold text-slate-800 mb-4">🔍 知識庫搜尋</h2>

    <!-- Search Input -->
    <div class="relative mb-6">
      <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        v-model="query"
        type="text"
        placeholder="輸入關鍵字搜尋所有標案知識..."
        class="w-full pl-12 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        @keyup.enter="search"
      />
    </div>

    <!-- Results -->
    <div v-if="results.length > 0" class="space-y-3">
      <div
        v-for="(result, idx) in results"
        :key="idx"
        class="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer"
      >
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{{ result.project_id }}</span>
          <h3 class="text-sm font-semibold text-slate-700">{{ result.project_name }}</h3>
        </div>
        <p class="text-sm text-slate-500 line-clamp-2">{{ result.snippet }}</p>
      </div>
    </div>

    <div v-else class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <p class="text-4xl mb-4">🔎</p>
        <p class="text-slate-400">輸入關鍵字開始搜尋知識庫</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const query = ref('')
const results = ref([])

function search() {
  // TODO: Call backend search API
  console.log('Search:', query.value)
}
</script>
