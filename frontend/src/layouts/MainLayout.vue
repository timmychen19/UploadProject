<template>
  <div class="flex h-screen overflow-hidden bg-slate-50">
    <!-- ═══ Sidebar (w-20) ═══ -->
    <aside class="w-20 bg-slate-900 flex flex-col items-center py-6 gap-6 shrink-0">
      <!-- Logo -->
      <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
        標
      </div>

      <nav class="flex flex-col items-center gap-4 mt-4">
        <SidebarIcon icon="folder" label="專案" :active="$route.name === 'Dashboard'" @click="$router.push('/')" />
        <SidebarIcon icon="search" label="搜尋" :active="$route.name === 'Search'" @click="$router.push('/search')" />
        <SidebarIcon icon="cog" label="設定" :active="$route.name === 'Settings'" @click="$router.push('/settings')" />
      </nav>

      <!-- Sync Button -->
      <div class="mt-auto">
        <button
          @click="handleSync"
          :disabled="syncStatus === 'syncing'"
          class="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
          :class="syncButtonClass"
          :title="syncTitle"
        >
          <svg v-if="syncStatus === 'syncing'" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </button>
      </div>
    </aside>

    <!-- ═══ Main Content ═══ -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header (h-16) -->
      <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
        <div class="flex items-center gap-3">
          <h1 class="text-lg font-semibold text-slate-800">標案自動化知識庫系統</h1>
          <span class="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">v1.0</span>
        </div>

        <!-- Global Search -->
        <div class="flex items-center gap-4">
          <div class="relative">
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="搜尋標案..."
              class="w-64 pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div class="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
            U
          </div>
        </div>
      </header>

      <!-- Body: Pipeline Monitor + Workspace -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Pipeline Monitor (w-80) -->
        <PipelineMonitor class="w-80 shrink-0" />

        <!-- Workspace (flex-1) -->
        <main class="flex-1 overflow-hidden">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import SidebarIcon from '@/components/SidebarIcon.vue'
import PipelineMonitor from '@/components/PipelineMonitor.vue'

const store = useProjectStore()

const syncStatus = computed(() => store.syncStatus)

const syncButtonClass = computed(() => {
  switch (syncStatus.value) {
    case 'syncing': return 'bg-amber-500 text-white cursor-wait'
    case 'success': return 'bg-emerald-500 text-white hover:bg-emerald-600'
    case 'error': return 'bg-rose-500 text-white hover:bg-rose-600'
    default: return 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
  }
})

const syncTitle = computed(() => {
  switch (syncStatus.value) {
    case 'syncing': return '同步中...'
    case 'success': return '同步成功！點擊再次同步'
    case 'error': return '同步失敗，點擊重試'
    default: return '推送至 GitHub'
  }
})

async function handleSync() {
  try {
    await store.syncToGit()
  } catch (err) {
    console.error(err)
  }
}
</script>
