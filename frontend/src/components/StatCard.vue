<template>
  <div class="bg-white rounded-xl p-4 border border-slate-200">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs text-slate-400 uppercase tracking-wider">{{ label }}</p>
        <p class="text-2xl font-bold mt-1" :class="valueColor">{{ value }}</p>
      </div>
      <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="iconBg">
        <svg class="w-5 h-5" :class="iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path v-if="icon === 'folder'" stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          <path v-else-if="icon === 'clock'" stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path v-else-if="icon === 'check'" stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path v-else-if="icon === 'photo'" stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], default: 0 },
  icon: { type: String, default: 'folder' },
  color: { type: String, default: 'blue' },
})

const colorMap = {
  blue:    { value: 'text-blue-600',    iconBg: 'bg-blue-50',    iconColor: 'text-blue-500' },
  amber:   { value: 'text-amber-600',   iconBg: 'bg-amber-50',   iconColor: 'text-amber-500' },
  emerald: { value: 'text-emerald-600', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  purple:  { value: 'text-purple-600',  iconBg: 'bg-purple-50',  iconColor: 'text-purple-500' },
}

const colors = computed(() => colorMap[props.color] || colorMap.blue)
const valueColor = computed(() => colors.value.value)
const iconBg = computed(() => colors.value.iconBg)
const iconColor = computed(() => colors.value.iconColor)
</script>
