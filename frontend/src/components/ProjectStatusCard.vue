<template>
  <div
    class="bg-white p-4 rounded-xl shadow-sm border transition-all cursor-pointer"
    :class="isSelected
      ? 'border-blue-500 ring-2 ring-blue-500/20'
      : 'border-slate-200 hover:border-blue-400'"
    @click="$emit('select', project)"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-semibold text-slate-800 truncate">{{ project.project_name }}</h3>
      <StatusDot :status="project.status" />
    </div>

    <!-- Project ID -->
    <p class="text-xs text-slate-400 mb-3">{{ project.project_id }}</p>

    <!-- Files -->
    <div class="flex flex-wrap gap-1 mb-3">
      <FileTypeBadge
        v-for="file in project.files?.slice(0, 5)"
        :key="file.name"
        :type="getFileExt(file.name)"
      />
      <span v-if="project.files?.length > 5" class="text-xs text-slate-400">
        +{{ project.files.length - 5 }}
      </span>
    </div>

    <!-- Progress Bar -->
    <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500"
        :class="progressBarClass"
        :style="{ width: `${progress}%` }"
      />
    </div>

    <!-- Status Row -->
    <div class="flex items-center justify-between mt-2">
      <span class="text-[11px]" :class="statusTextClass">{{ statusText }}</span>
      <span class="text-[11px] text-slate-400">{{ project.files?.length || 0 }} 個檔案</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FileTypeBadge from './FileTypeBadge.vue'
import StatusDot from './StatusDot.vue'

const props = defineProps({
  project: { type: Object, required: true },
  isSelected: { type: Boolean, default: false },
})

defineEmits(['select'])

function getFileExt(name) {
  return name.split('.').pop().toLowerCase()
}

const progress = computed(() => {
  switch (props.project.status) {
    case 'uploaded': return 25
    case 'processing': return 60
    case 'parsed': return 80
    case 'ready': return 100
    case 'error': return props.project.progress || 0
    default: return 0
  }
})

const progressBarClass = computed(() => {
  switch (props.project.status) {
    case 'processing': return 'bg-amber-500 animate-pulse'
    case 'ready': return 'bg-emerald-500'
    case 'error': return 'bg-rose-500'
    default: return 'bg-blue-500'
  }
})

const statusText = computed(() => {
  const map = {
    uploaded: '已上傳',
    processing: '解析中...',
    parsed: '已轉換',
    ready: '知識庫就緒',
    error: '處理失敗',
  }
  return map[props.project.status] || '未知'
})

const statusTextClass = computed(() => {
  const map = {
    processing: 'text-amber-600',
    ready: 'text-emerald-600',
    error: 'text-rose-600',
  }
  return map[props.project.status] || 'text-slate-500'
})
</script>
