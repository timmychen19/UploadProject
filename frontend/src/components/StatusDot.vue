<template>
  <span class="relative flex h-2.5 w-2.5">
    <span
      v-if="status === 'processing'"
      class="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
      :class="dotColor"
    />
    <span class="relative inline-flex rounded-full h-2.5 w-2.5" :class="dotColor" />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, default: 'idle' },
})

const dotColor = computed(() => {
  const map = {
    uploaded: 'bg-blue-400',
    processing: 'bg-amber-400',
    parsed: 'bg-cyan-400',
    ready: 'bg-emerald-400',
    error: 'bg-rose-400',
  }
  return map[props.status] || 'bg-slate-300'
})
</script>
