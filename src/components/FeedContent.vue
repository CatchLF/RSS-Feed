<template>
  <div class="feed-content">
    <h2 class="mb-6 text-2xl font-bold text-gray-800">{{ selectedFeed ? selectedFeed.title : '所有文章' }}</h2>
    <ul class="space-y-6">
      <li v-for="article in displayedArticles" :key="article.id" class="p-4 border rounded shadow-md">
        <div class="flex items-center justify-between cursor-pointer article-header" @click="toggleContent(article)">
          <div class="flex items-center article-info">
            <span class="px-2 py-1 mr-2 text-sm text-gray-600 bg-gray-200 rounded article-source">{{
              getArticleSource(article) }}</span>
            <h3 class="text-lg font-semibold" :class="{ 'opacity-60': article.isRead }">{{ article.title }}</h3>
          </div>
          <span class="text-sm text-gray-600 article-date">{{ article.pubDate }}</span>
        </div>
        <div v-if="visibleContentId === article.id" v-html="article.content"
          class="max-w-full mt-4 overflow-x-auto text-gray-700"></div>
        <a :href="article.link" target="_blank" class="inline-block mt-4 text-blue-500 hover:underline">阅读原文</a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Article, Feed } from '@/types';
const props = defineProps<{
  articles: Article[],
  selectedFeed?: Feed | null,
  feeds: Feed[]
}>();

const emit = defineEmits<{
  (e: 'mark-as-read', id: string): void
}>();

const visibleContentId = ref<string | null>(null);

const displayedArticles = computed(() => {
  if (!props.selectedFeed) {
    return props.articles;
  }
  return props.articles.filter(article => article.feedId === props.selectedFeed?.id);
});

const toggleContent = (article: Article) => {
  visibleContentId.value = visibleContentId.value === article.id ? null : article.id;
  if (!article.isRead) {
    emit('mark-as-read', article.id);
  }
};

const getArticleSource = (article: Article) => {
  const feed = props.feeds.find(feed => feed.id === article.feedId);
  return feed ? feed.title : '未知来源';
};
</script>