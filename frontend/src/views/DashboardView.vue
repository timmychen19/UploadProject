<template>
  <div class="h-full flex flex-col p-6 overflow-y-auto scrollbar-thin">
    <!-- Welcome Section -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-slate-800 mb-2">歡迎使用標案知識庫</h2>
      <p class="text-slate-500">從左側建立標案，上傳文件後系統將自動解析、轉換並建立知識庫。</p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-4 gap-4 mb-8">
      <StatCard label="標案總數" :value="store.projectCount" icon="folder" color="blue" />
      <StatCard label="處理中" :value="store.processingProjects.length" icon="clock" color="amber" />
      <StatCard label="知識庫就緒" :value="readyCount" icon="check" color="emerald" />
      <StatCard label="提取圖片" :value="totalImages" icon="photo" color="purple" />
    </div>

    <!-- Drag & Drop Upload Zone -->
    <div
      class="border-2 border-dashed rounded-2xl p-12 text-center transition-all mb-8"
      :class="isDragging
        ? 'border-blue-500 bg-blue-50/50'
        : 'border-slate-300 bg-white hover:border-slate-400'"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-slate-600 mb-1">
        {{ isDragging ? '放開即可上傳' : '拖曳檔案到此處' }}
      </h3>
      <p class="text-sm text-slate-400">支援 PDF、PPTX、DOCX、XLSX、MD 格式</p>
    </div>

    <!-- Recent Activity -->
    <div>
      <h3 class="text-sm font-semibold text-slate-700 mb-3">最近活動</h3>
      <div class="space-y-2">
        <div
          v-for="(activity, idx) in recentActivity"
          :key="idx"
          class="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100"
        >
          <StatusDot :status="activity.status" />
          <div class="flex-1 min-w-0">
            <p class="text-sm text-slate-700 truncate">{{ activity.message }}</p>
            <p class="text-xs text-slate-400">{{ activity.time }}</p>
          </div>
        </div>
        <p v-if="recentActivity.length === 0" class="text-sm text-slate-400 text-center py-4">
          尚無活動紀錄
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import StatCard from '@/components/StatCard.vue'
import StatusDot from '@/components/StatusDot.vue'

const store = useProjectStore()
const isDragging = ref(false)

const readyCount = computed(() =>
  store.projects.filter(p => p.status === 'ready').length
)
const totalImages = computed(() =>
  store.projects.reduce((sum, p) => sum + (p.imageCount || 0), 0)
)

const recentActivity = ref([])

function handleDrop(e) {
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files)
  console.log('Dropped files:', files)
}
</script>
