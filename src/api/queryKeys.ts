interface FeedKeys {
  all: string[];
  lists: (tab: string, category: string) => string[];
  detail: (id: number) => string[];
  bookmarks: () => string[];
  search: (keyword: string) => string[];
  myPosts: () => string[];
}

export const feedKeys: FeedKeys = {
  all: ['feeds'],
  lists: (tab, category) => ['feeds', 'list', tab, category],
  detail: (id) => ['feeds', 'detail', id.toString()],
  bookmarks: () => ['feeds', 'bookmarks'],
  search: (keyword) => ['feeds', 'search', keyword],
  myPosts: () => ['feeds', 'myPosts'],
};
