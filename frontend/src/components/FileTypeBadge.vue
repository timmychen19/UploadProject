<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ring-1"
    :class="badgeClass"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, required: true }, // pdf, xlsx, md, pptx, docx
})

const label = computed(() => props.type.toUpperCase())

const badgeClass = computed(() => {
  const map = {
    pdf:  'bg-red-50 text-red-600 ring-red-200',
    xlsx: 'bg-green-50 text-green-600 ring-green-200',
    md:   'bg-blue-50 text-blue-600 ring-blue-200',
    pptx: 'bg-orange-50 text-orange-600 ring-orange-200',
    docx: 'bg-indigo-50 text-indigo-600 ring-indigo-200',
  }
  return map[props.type] || 'bg-slate-50 text-slate-600 ring-slate-200'
})
</script>
