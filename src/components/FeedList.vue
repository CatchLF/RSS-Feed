<template>
  <div class="feed-list">
    <h2>订阅源列表</h2>
    <ul>
      <li v-for="feed in feeds" :key="feed.id" @click="$emit('select-feed', feed)">
        {{ feed.title }}
        <button @click.stop="$emit('refresh-feed', feed)">刷新</button>
        <button @click.stop="$emit('delete-feed', feed.id)">删除</button>
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

<style scoped>
.feed-list {
  min-width: 300px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

li:hover {
  background-color: #f5f5f5;
}

button {
  margin-left: 10px;
}
</style>
