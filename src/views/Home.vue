<template>
  <div class="min-h-screen p-6 bg-gray-100 home">
    <h1 class="mb-6 text-3xl font-bold text-center text-gray-800">RSS 阅读器</h1>
    <div class="flex justify-center mb-6 add-feed">
      <input v-model="newFeedUrl" placeholder="输入 RSS 订阅源 URL" class="w-full max-w-md p-2 mr-2 border" />
      <button @click="addFeed" class="px-4 py-2 text-white bg-blue-500 rounded">添加订阅源</button>
    </div>
    <div class="flex space-x-6 main-content">
      <FeedList :feeds="feeds" @select-feed="selectFeed" @delete-feed="deleteFeed" @refresh-feed="refreshFeed"
        class="w-1/4 p-4 bg-white rounded shadow-lg" />
      <div class="flex-grow p-4 bg-white rounded shadow-lg feed-content-wrapper">
        <FeedContent :articles="articles" :selectedFeed="selectedFeed" :feeds="feeds"
          @mark-as-read="markArticleAsRead" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Parser from 'rss-parser/dist/rss-parser.min.js';
import { addFeed as dbAddFeed, getAllFeeds, deleteFeed as dbDeleteFeed, addArticles, getArticlesByFeed, markArticleAsRead as dbMarkArticleAsRead, deleteArticlesByFeed, getAllArticles } from '@/services/db';
import type { Feed, Article } from '@/types';
import { formatDate } from '@/utils/dateFormatter';
import FeedList from '@/components/FeedList.vue';
import FeedContent from '@/components/FeedContent.vue';

const parser = new Parser();

const feeds = ref<Feed[]>([]);
const articles = ref<Article[]>([]);
const newFeedUrl = ref('');
const selectedFeed = ref<Feed | null>(null);

const loadFeeds = async () => {
  feeds.value = await getAllFeeds();
  articles.value = await getAllArticles();
};

onMounted(loadFeeds);



const addFeed = async () => {
  if (newFeedUrl.value) {
    try {
      const feed = await parser.parseURL(newFeedUrl.value);

      const id = await dbAddFeed({
        url: newFeedUrl.value,
        title: feed.title || '未命名订阅源',
      });

      feeds.value.push({
        id,
        url: newFeedUrl.value,
        title: feed.title || '未命名订阅源',
      });

      await addArticles(id, feed.items.map((item: any) => ({
        title: item.title,
        link: item.link,
        pubDate: formatDate(item.pubDate || item.isoDate),
        content: item.content || item.description,
      })));

      // 添加新文章后，重新获取所有文章并排序
      articles.value = await getAllArticles();
      articles.value.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

      newFeedUrl.value = '';
    } catch (error) {
      console.error('添加订阅源时出错:', error);
      alert('无法添加RSS源。请检查URL是否正确，或者该源是否支持跨域访问。');
    }
  }
};

const selectFeed = async (feed: Feed) => {
  try {
    articles.value = await getArticlesByFeed(feed.id);
  } catch (error) {
    console.error('Error fetching articles:', error);
    alert('无法获取文章。请稍后再试。');
  }
};

const deleteFeed = async (id: number) => {
  await dbDeleteFeed(id);
  await deleteArticlesByFeed(id);
  feeds.value = feeds.value.filter(feed => feed.id !== id);
  if (articles.value.length > 0 && articles.value[0].feedId === id) {
    articles.value = [];
  }
};

const markArticleAsRead = async (articleId: string) => {
  await dbMarkArticleAsRead(articleId);
  const index = articles.value.findIndex(a => a.id === articleId);
  if (index !== -1) {
    articles.value[index].isRead = true;
  }
};

const refreshFeed = async (feed: Feed) => {
  try {
    const result = await parser.parseURL(feed.url);
    const newArticles = result.items.map((item: any) => ({
      title: item.title,
      link: item.link,
      pubDate: formatDate(item.pubDate || item.isoDate),
      content: item.content || item.description,
      feedId: feed.id,
    }));

    await addArticles(feed.id, newArticles);

    // 重新获取所有文章并排序
    articles.value = await getAllArticles();
    articles.value.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    if (selectedFeed.value && selectedFeed.value?.id === feed.id) {
      // 如果当前选中的是刚刚刷新的订阅源，更新显示的文章
      articles.value = articles.value.filter(article => article.feedId === feed.id);
    }

    alert('文章已更新');
  } catch (error) {
    console.error('刷新订阅源时出错:', error);
    alert('刷新文章失败。请检查网络连接或该源是否支持跨域访问。');
  }
};
</script>