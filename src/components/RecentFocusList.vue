<script setup>
defineProps({ records: { type: Array, default: () => [] } })
defineEmits(['select'])
</script>

<template>
  <div class="recent-list" data-testid="recent-focus-users">
    <button v-for="record in records" :key="record.id" type="button" class="recent-row" @click="$emit('select', record)">
      <span class="status-dot focus"></span>
      <span class="recent-date">{{ record.lastActiveDay.slice(5) }}</span>
      <span class="recent-content"><strong>{{ record.phone }}</strong><small>{{ record.activeDays }} 个活跃日 · {{ record.id }}</small></span>
      <span class="recent-status">{{ record.status }}</span>
    </button>
    <div v-if="!records.length" class="empty-state">当前周期暂无重点关怀样本</div>
  </div>
</template>
