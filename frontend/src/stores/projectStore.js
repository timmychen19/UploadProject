import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const useProjectStore = defineStore('project', () => {
  // ── State ──
  const projects = ref([])
  const currentProject = ref(null)
  const uploadProgress = ref({})  // { fileId: { percent, status } }
  const syncStatus = ref('idle')  // idle | syncing | success | error
  const syncLogs = ref([])

  // ── Getters ──
  const projectCount = computed(() => projects.value.length)
  const processingProjects = computed(() =>
    projects.value.filter(p => p.status === 'processing')
  )

  // ── Actions ──
  async function fetchProjects() {
    try {
      const { data } = await api.get('/projects')
      projects.value = data
    } catch (err) {
      console.error('Failed to fetch projects:', err)
    }
  }

  async function createProject(projectId, projectName) {
    try {
      const { data } = await api.post('/projects', {
        project_id: projectId,
        project_name: projectName,
      })
      projects.value.unshift(data)
      currentProject.value = data
      return data
    } catch (err) {
      console.error('Failed to create project:', err)
      throw err
    }
  }

  async function uploadFiles(projectFolder, files, onProgress) {
    const formData = new FormData()
    formData.append('project_folder', projectFolder)
    files.forEach(f => formData.append('files', f))

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total)
          if (onProgress) onProgress(percent)
        },
      })
      return data
    } catch (err) {
      console.error('Upload failed:', err)
      throw err
    }
  }

  async function parseFiles(projectFolder) {
    try {
      const { data } = await api.post('/parse', { project_folder: projectFolder })
      return data
    } catch (err) {
      console.error('Parse failed:', err)
      throw err
    }
  }

  async function syncToGit(branch = 'main', message = null) {
    syncStatus.value = 'syncing'
    syncLogs.value = []
    try {
      const { data } = await api.post('/sync', { branch, message })
      syncLogs.value = data.logs || []
      syncStatus.value = data.success ? 'success' : 'error'
      return data
    } catch (err) {
      syncStatus.value = 'error'
      syncLogs.value = [err.message]
      throw err
    }
  }

  function setCurrentProject(project) {
    currentProject.value = project
  }

  return {
    projects,
    currentProject,
    uploadProgress,
    syncStatus,
    syncLogs,
    projectCount,
    processingProjects,
    fetchProjects,
    createProject,
    uploadFiles,
    parseFiles,
    syncToGit,
    setCurrentProject,
  }
})
