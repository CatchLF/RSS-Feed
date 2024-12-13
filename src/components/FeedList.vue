<template>
  <div class="feed-list">
    <h2 class="mb-4 text-xl font-bold text-gray-800">订阅源列表</h2>
    <ul class="space-y-2">
      <li v-for="feed in feeds" :key="feed.id" @click="$emit('select-feed', feed)"
        class="p-3 border-b cursor-pointer hover:bg-gray-100">
        <div class="flex items-center justify-between">
          <span class="text-gray-700">{{ feed.title }}</span>
          <div>
            <button @click.stop="$emit('refresh-feed', feed)"
              class="text-sm text-blue-500 hover:text-blue-700">刷新</button>
            <button @click.stop="$emit('delete-feed', feed.id)"
              class="ml-2 text-sm text-red-500 hover:text-red-700">删除</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Feed } from '@/types';

defineProps<{
  feeds: Feed[]
}>();

defineEmits<{
  (e: 'select-feed', feed: Feed): void
  (e: 'delete-feed', id: number): void
  (e: 'refresh-feed', feed: Feed): void
}>();
</script>