<template>
  <div class="h-full flex flex-col p-6 overflow-y-auto scrollbar-thin">
    <h2 class="text-xl font-bold text-slate-800 mb-6">⚙️ 系統設定</h2>

    <div class="max-w-2xl space-y-6">
      <!-- Git Settings -->
      <section class="bg-white rounded-xl p-6 border border-slate-200">
        <h3 class="text-sm font-semibold text-slate-700 mb-4">☁️ Git 同步設定</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-xs text-slate-500 mb-1">遠端倉庫 URL</label>
            <input
              v-model="settings.gitRemoteUrl"
              type="text"
              class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/user/repo.git"
            />
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1">預設分支</label>
            <input
              v-model="settings.gitBranch"
              type="text"
              class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      <!-- AI Settings -->
      <section class="bg-white rounded-xl p-6 border border-slate-200">
        <h3 class="text-sm font-semibold text-slate-700 mb-4">🤖 AI 分析設定</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-xs text-slate-500 mb-1">Azure OpenAI Endpoint</label>
            <input
              v-model="settings.aiEndpoint"
              type="text"
              class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1">部署名稱</label>
            <input
              v-model="settings.aiDeployment"
              type="text"
              class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      <!-- Relevance Settings -->
      <section class="bg-white rounded-xl p-6 border border-slate-200">
        <h3 class="text-sm font-semibold text-slate-700 mb-4">🎯 相關性過濾設定</h3>
        <div>
          <label class="block text-xs text-slate-500 mb-1">
            相關性門檻值: {{ settings.relevanceThreshold }}
          </label>
          <input
            v-model.number="settings.relevanceThreshold"
            type="range"
            min="1"
            max="20"
            step="0.5"
            class="w-full"
          />
          <p class="text-xs text-slate-400 mt-1">較高的門檻值會過濾更多非相關文件</p>
        </div>
      </section>

      <!-- Save Button -->
      <button
        @click="saveSettings"
        class="w-full py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
      >
        💾 儲存設定
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const settings = reactive({
  gitRemoteUrl: 'https://github.com/timmychen19/UploadProject.git',
  gitBranch: 'main',
  aiEndpoint: '',
  aiDeployment: 'gpt-4o-mini',
  relevanceThreshold: 5.0,
})

function saveSettings() {
  // TODO: Save to backend
  console.log('Settings saved:', settings)
}
</script>
