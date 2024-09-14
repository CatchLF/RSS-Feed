<template>
  <div class="home">
    <h1>RSS阅读器</h1>
    <div class="add-feed">
      <input v-model="newFeedUrl" placeholder="输入RSS源URL" />
      <button @click="addFeed">添加</button>
    </div>
    <div class="main-content">
      <FeedList
        :feeds="feeds"
        @select-feed="selectFeed"
        @delete-feed="deleteFeed"
        @refresh-feed="refreshFeed"
      />
      <FeedContent :articles="articles" @mark-as-read="markArticleAsRead" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Parser from 'rss-parser/dist/rss-parser.min.js';
import { addFeed as dbAddFeed, getAllFeeds, deleteFeed as dbDeleteFeed, addArticles, getArticlesByFeed, markArticleAsRead as dbMarkArticleAsRead, deleteArticlesByFeed, getFeedByUrl } from '@/services/db';
import type { Feed, Article } from '@/types';
import { formatDate } from '@/utils/dateFormatter';
import FeedList from '@/components/FeedList.vue';
import FeedContent from '@/components/FeedContent.vue';

const parser = new Parser();

const feeds = ref<Feed[]>([]);
const articles = ref<Article[]>([]);
const newFeedUrl = ref('');

const loadFeeds = async () => {
  feeds.value = await getAllFeeds();
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

    if (selectedFeedId.value === feed.id) {
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

<style scoped>
.add-feed {
  margin-bottom: 20px;
}

.main-content {
  display: flex;
  gap: 20px;
}
</style>