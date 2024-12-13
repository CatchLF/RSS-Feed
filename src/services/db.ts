import { openDB, type DBSchema } from "idb";
import type { Feed, Article } from "../types/index";

interface MyDB extends DBSchema {
  feeds: {
    key: number;
    value: Feed;
    indexes: { "by-url": string };
  };
  articles: {
    key: string;
    value: Article;
    indexes: { "by-feed": number };
  };
}

const dbPromise = openDB<MyDB>("RSSReaderDB", 1, {
  upgrade(db) {
    const feedStore = db.createObjectStore("feeds", {
      keyPath: "id",
      autoIncrement: true,
    });
    feedStore.createIndex("by-url", "url", { unique: true });

    const articleStore = db.createObjectStore("articles", { keyPath: "id" });
    articleStore.createIndex("by-feed", "feedId");
  },
});

export async function addFeed(feed: Omit<Feed, "id">): Promise<number> {
  const db = await dbPromise;
  return db.add("feeds", feed as Feed);
}

export async function getAllFeeds(): Promise<Feed[]> {
  const db = await dbPromise;
  return db.getAll("feeds");
}

export async function deleteFeed(id: number): Promise<void> {
  const db = await dbPromise;
  await db.delete("feeds", id);
}

export async function getFeedByUrl(url: string): Promise<Feed | undefined> {
  const db = await dbPromise;
  return db.getFromIndex("feeds", "by-url", url);
}

export async function addArticles(
  feedId: number,
  articles: Omit<Article, "id" | "feedId" | "isRead">[]
): Promise<void> {
  const db = await dbPromise;
  const tx = db.transaction("articles", "readwrite");
  for (const article of articles) {
    await tx.store.put({
      ...article,
      id: `${feedId}-${article.link}`,
      feedId,
      isRead: false,
    });
  }
  await tx.done;
}

export async function getArticlesByFeed(feedId: number): Promise<Article[]> {
  const db = await dbPromise;
  return db.getAllFromIndex("articles", "by-feed", feedId);
}

export async function markArticleAsRead(articleId: string): Promise<void> {
  const db = await dbPromise;
  const tx = db.transaction("articles", "readwrite");
  const article = await tx.store.get(articleId);
  if (article) {
    article.isRead = true;
    await tx.store.put(article);
  }
  await tx.done;
}

export async function deleteArticlesByFeed(feedId: number): Promise<void> {
  const db = await dbPromise;
  const tx = db.transaction("articles", "readwrite");
  const index = tx.store.index("by-feed");
  let cursor = await index.openCursor(feedId);
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
  await tx.done;
}

export async function getAllArticles(): Promise<Article[]> {
  const db = await dbPromise;
  const articles = await db.getAll("articles");
  return articles.sort((a, b) => b.pubDate.localeCompare(a.pubDate));
}
