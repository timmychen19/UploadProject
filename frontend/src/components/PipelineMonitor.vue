<template>
  <aside class="bg-white border-r border-slate-200 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="p-4 border-b border-slate-100">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold text-slate-700">標案管線</h2>
        <span class="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
          {{ store.projectCount }} 件
        </span>
      </div>

      <!-- New Project Button -->
      <button
        @click="showNewProject = true"
        class="w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
      >
        + 新增標案
      </button>
    </div>

    <!-- New Project Form (inline) -->
    <div v-if="showNewProject" class="p-4 border-b border-slate-100 bg-slate-50 space-y-2">
      <input
        v-model="newId"
        placeholder="標案編號"
        class="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        v-model="newName"
        placeholder="標案名稱"
        class="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div class="flex gap-2">
        <button
          @click="createProject"
          :disabled="!newId || !newName"
          class="flex-1 py-1.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 rounded-lg transition-colors"
        >
          建立
        </button>
        <button
          @click="showNewProject = false"
          class="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg"
        >
          取消
        </button>
      </div>
    </div>

    <!-- Project List -->
    <div class="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
      <ProjectStatusCard
        v-for="project in store.projects"
        :key="project.project_id"
        :project="project"
        :is-selected="store.currentProject?.project_id === project.project_id"
        @select="handleSelect"
      />

      <!-- Empty State -->
      <div v-if="store.projects.length === 0" class="text-center py-12">
        <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-sm text-slate-400">尚無標案</p>
        <p class="text-xs text-slate-300 mt-1">點擊上方「+ 新增標案」開始</p>
      </div>
    </div>

    <!-- Pipeline Stats -->
    <div class="p-3 border-t border-slate-100 bg-slate-50/50">
      <div class="grid grid-cols-3 gap-2 text-center">
        <div>
          <p class="text-lg font-bold text-slate-700">{{ rawCount }}</p>
          <p class="text-[10px] text-slate-400">原始檔</p>
        </div>
        <div>
          <p class="text-lg font-bold text-cyan-600">{{ parsedCount }}</p>
          <p class="text-[10px] text-slate-400">已轉換</p>
        </div>
        <div>
          <p class="text-lg font-bold text-emerald-600">{{ readyCount }}</p>
          <p class="text-[10px] text-slate-400">知識庫</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import ProjectStatusCard from './ProjectStatusCard.vue'

const store = useProjectStore()
const router = useRouter()

const showNewProject = ref(false)
const newId = ref('')
const newName = ref('')

const rawCount = computed(() =>
  store.projects.filter(p => p.status === 'uploaded').length
)
const parsedCount = computed(() =>
  store.projects.filter(p => ['parsed', 'processing'].includes(p.status)).length
)
const readyCount = computed(() =>
  store.projects.filter(p => p.status === 'ready').length
)

async function createProject() {
  try {
    const project = await store.createProject(newId.value, newName.value)
    newId.value = ''
    newName.value = ''
    showNewProject.value = false
    router.push(`/project/${project.project_id}`)
  } catch (err) {
    alert('建立失敗: ' + err.message)
  }
}

function handleSelect(project) {
  store.setCurrentProject(project)
  router.push(`/project/${project.project_id}`)
}
</script>
