<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Toolbar -->
    <div class="flex items-center justify-between p-3 border-b border-slate-200 bg-white shrink-0">
      <div class="flex items-center gap-3">
        <h2 class="text-sm font-semibold text-slate-700">
          {{ currentProject?.project_name || '未選擇標案' }}
        </h2>
        <span class="text-xs text-slate-400">{{ currentProject?.project_id }}</span>
        <span
          v-if="currentProject"
          class="text-xs px-2 py-0.5 rounded-full font-medium"
          :class="statusBadgeClass"
        >
          {{ statusText }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <!-- Upload Button -->
        <label class="cursor-pointer px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
          <input type="file" multiple accept=".pdf,.pptx,.docx,.xlsx,.md" class="hidden" @change="handleFileUpload" />
          📎 上傳檔案
        </label>

        <!-- Parse Button -->
        <button
          @click="handleParse"
          :disabled="!hasFiles || isParsing"
          class="px-3 py-1.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 rounded-lg transition-colors"
        >
          {{ isParsing ? '⏳ 解析中...' : '🔄 解析轉換' }}
        </button>

        <!-- Fullscreen Toggle -->
        <button
          @click="isFullscreen = !isFullscreen"
          class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="全螢幕切換"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path v-if="!isFullscreen" stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Split View Workspace -->
    <div class="flex-1 flex gap-4 p-4 overflow-hidden" :class="{ 'fixed inset-0 z-50 bg-slate-50': isFullscreen }">
      <!-- Left: Source / PDF Viewer -->
      <div class="flex-1 bg-slate-800 rounded-2xl shadow-inner relative overflow-hidden flex flex-col">
        <div class="flex items-center justify-between px-4 py-2 bg-slate-900/50">
          <span class="text-xs text-slate-400">原始文件預覽</span>
          <div class="flex gap-1">
            <button
              v-for="file in uploadedFiles"
              :key="file.name"
              @click="activeSourceFile = file"
              class="px-2 py-0.5 text-xs rounded transition-colors"
              :class="activeSourceFile?.name === file.name
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'"
            >
              {{ file.name }}
            </button>
          </div>
        </div>
        <div class="flex-1 flex items-center justify-center text-slate-500 p-8 overflow-y-auto scrollbar-thin">
          <div v-if="!activeSourceFile" class="text-center">
            <p class="text-lg mb-2">📄</p>
            <p class="text-sm">上傳檔案後，於此預覽原始文件</p>
          </div>
          <div v-else class="w-full h-full">
            <!-- PDF preview placeholder -->
            <div class="bg-white rounded-lg p-6 text-slate-800 overflow-y-auto h-full scrollbar-thin">
              <p class="text-sm text-slate-400 mb-4">📄 {{ activeSourceFile.name }}</p>
              <p class="text-xs text-slate-500">
                檔案大小: {{ (activeSourceFile.size / 1024).toFixed(1) }} KB
              </p>
              <p class="text-xs text-slate-400 mt-2">
                （PDF.js 整合預計在後續版本實作）
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Markdown Editor/Preview -->
      <div class="flex-1 bg-white rounded-2xl shadow-sm flex flex-col border border-slate-200 overflow-hidden">
        <!-- MD Toolbar -->
        <div class="flex items-center justify-between p-3 border-b bg-slate-50/50 shrink-0">
          <div class="flex items-center gap-2">
            <button
              @click="mdViewMode = 'edit'"
              class="px-2 py-1 text-xs rounded transition-colors"
              :class="mdViewMode === 'edit' ? 'bg-blue-500 text-white' : 'text-slate-500 hover:bg-slate-200'"
            >
              編輯
            </button>
            <button
              @click="mdViewMode = 'preview'"
              class="px-2 py-1 text-xs rounded transition-colors"
              :class="mdViewMode === 'preview' ? 'bg-blue-500 text-white' : 'text-slate-500 hover:bg-slate-200'"
            >
              預覽
            </button>
            <button
              @click="mdViewMode = 'split'"
              class="px-2 py-1 text-xs rounded transition-colors"
              :class="mdViewMode === 'split' ? 'bg-blue-500 text-white' : 'text-slate-500 hover:bg-slate-200'"
            >
              雙欄
            </button>
          </div>
          <span class="text-xs text-slate-400">
            {{ mdContent.length }} 字元
          </span>
        </div>

        <!-- MD Content -->
        <div class="flex-1 overflow-hidden" :class="{ 'flex gap-0': mdViewMode === 'split' }">
          <!-- Editor -->
          <textarea
            v-if="mdViewMode === 'edit' || mdViewMode === 'split'"
            v-model="mdContent"
            class="w-full h-full p-6 text-sm font-mono text-slate-700 bg-white resize-none focus:outline-none overflow-y-auto scrollbar-thin"
            :class="{ 'flex-1 border-r border-slate-200': mdViewMode === 'split' }"
            placeholder="轉換後的 Markdown 將顯示在此..."
          />

          <!-- Preview -->
          <div
            v-if="mdViewMode === 'preview' || mdViewMode === 'split'"
            class="p-8 prose prose-slate max-w-none overflow-y-auto scrollbar-thin"
            :class="{ 'flex-1': mdViewMode === 'split', 'h-full': true }"
            v-html="renderedMarkdown"
          />
        </div>
      </div>
    </div>

    <!-- Image Drawer -->
    <ImageDrawer :images="extractedImages" @select-image="insertImage" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import ImageDrawer from '@/components/ImageDrawer.vue'

const props = defineProps({
  id: { type: String },
})

const store = useProjectStore()
const currentProject = computed(() => store.currentProject)

const isFullscreen = ref(false)
const mdViewMode = ref('preview') // edit | preview | split
const mdContent = ref('')
const uploadedFiles = ref([])
const activeSourceFile = ref(null)
const extractedImages = ref([])
const isParsing = ref(false)

const hasFiles = computed(() => uploadedFiles.value.length > 0)

const statusBadgeClass = computed(() => {
  const map = {
    uploaded:    'bg-blue-50 text-blue-600',
    processing:  'bg-amber-50 text-amber-700 animate-pulse',
    parsed:      'bg-cyan-50 text-cyan-600',
    ready:       'bg-emerald-50 text-emerald-700',
    error:       'bg-rose-50 text-rose-600',
  }
  return map[currentProject.value?.status] || 'bg-slate-50 text-slate-500'
})

const statusText = computed(() => {
  const map = {
    uploaded: '已上傳',
    processing: '解析中...',
    parsed: '已轉換',
    ready: '知識庫就緒',
    error: '處理失敗',
  }
  return map[currentProject.value?.status] || '未知'
})

// Simple markdown to HTML (basic)
const renderedMarkdown = computed(() => {
  if (!mdContent.value) return '<p class="text-slate-400">尚無 Markdown 內容</p>'
  // Basic conversion - in production use marked.js
  return mdContent.value
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="rounded-lg" />')
    .replace(/\n/g, '<br/>')
})

function handleFileUpload(e) {
  const files = Array.from(e.target.files)
  uploadedFiles.value = files
  if (files.length > 0) {
    activeSourceFile.value = files[0]
  }
}

async function handleParse() {
  if (!currentProject.value) return
  isParsing.value = true
  try {
    const folder = `${currentProject.value.project_id}_${currentProject.value.project_name}`
    await store.uploadFiles(folder, uploadedFiles.value)
    const result = await store.parseFiles(folder)
    mdContent.value = result.markdown || ''
    extractedImages.value = result.images || []
  } catch (err) {
    console.error('Parse error:', err)
  } finally {
    isParsing.value = false
  }
}

function insertImage(img) {
  mdContent.value += `\n![${img.name}](images/${img.name})\n`
}
</script>
