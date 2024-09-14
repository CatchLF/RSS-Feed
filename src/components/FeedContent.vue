<template>
  <div class="feed-content">
    <h2>文章列表</h2>
    <ul>
      <li v-for="article in articles" :key="article.id" :class="{ 'read': article.isRead }">
        <h3>{{ article.title }}</h3>
        <p>{{ article.pubDate }}</p>
        <div v-html="article.content"></div>
        <a :href="article.link" target="_blank">阅读原文</a>
        <button v-if="!article.isRead" @click="$emit('mark-as-read', article.id)">标记为已读</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '@/types';

defineProps<{
  articles: Article[]
}>();

defineEmits<{
  (e: 'mark-as-read', id: string): void
}>();
</script>

<style scoped>
.feed-content {
  flex-grow: 1;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #eee;
}

.read {
  opacity: 0.6;
}

h3 {
  margin-top: 0;
}

a {
  display: inline-block;
  margin-top: 10px;
}

button {
  margin-left: 10px;
}
</style>
