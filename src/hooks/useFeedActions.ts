import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike, toggleBookmark } from "@/api/feed/getFeeds";
import { feedKeys } from "@/api/queryKeys";

export const useFeedActions = () => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: toggleBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
    },
  });

  return {
    handleLike: likeMutation.mutateAsync,
    handleBookmark: bookmarkMutation.mutateAsync,
  };
};
