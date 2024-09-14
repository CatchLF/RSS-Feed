export interface Feed {
  id: number;
  url: string;
  title: string;
}

export interface Article {
  id: string;
  feedId: number;
  title: string;
  link: string;
  pubDate: string;
  content: string;
  isRead: boolean;
}
