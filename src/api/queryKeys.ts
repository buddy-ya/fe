// @/api/queryKeys.ts
interface FeedKeys {
  all: string[];
  lists: (category: string) => string[];
  detail: (id: number) => string[];
}

export const feedKeys: FeedKeys = {
  all: ["feeds"],
  lists: (category) => ["feeds", "list", category],
  detail: (id) => ["feeds", "detail", id.toString()],
};
