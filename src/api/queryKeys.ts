interface FeedKeys {
  all: string[];
  lists: (category: string) => string[];
  detail: (id: number) => string[];
  bookmarks: () => string[];
  search: (keyword: string) => string[];
  myPosts: () => string[];
}

export const feedKeys: FeedKeys = {
  all: ["feeds"],
  lists: (category) => ["feeds", "list", category],
  detail: (id) => ["feeds", "detail", id.toString()],
  bookmarks: () => ["feeds", "bookmarks"],
  search: (keyword) => ["feeds", "search", keyword],
  myPosts: () => ["feeds", "myPosts"],
};
