import { RefreshControl, RefreshControlProps } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ChatRequest } from '@/types';
import { EmptyState } from '../common';
import RequestItem from './RequestItem';

interface RequestListProps {
  requests: ChatRequest[];
  isLoading?: boolean;
  hasMore?: boolean;
  className?: string;
  onLoadMore?: () => void;
  onProfilePress?: (id: number) => void;
  onDecline?: (chatRequestId: number) => void;
  onAccept?: (receiverId: number) => void;
  refreshControl?: RefreshControlProps | null;
  emptyStateMessage?: string;
}

export default function RequestList({
  requests,
  isLoading,
  hasMore,
  className,
  onLoadMore,
  onProfilePress,
  onDecline,
  onAccept,
  refreshControl,
  emptyStateMessage,
}: RequestListProps) {
  if (requests.length === 0) {
    return <EmptyState message={emptyStateMessage || '요청이 없습니다.'} />;
  }

  return (
    <FlatList
      data={requests}
      renderItem={({ item }) => (
        <RequestItem
          key={item.id}
          onProfilePress={onProfilePress}
          onAccept={onAccept}
          onDecline={onDecline}
          request={item}
        />
      )}
      className={`mt-1 ${className}`}
      keyExtractor={(item) => `room-${item.id}`}
      onEndReached={hasMore ? onLoadMore : null}
      onEndReachedThreshold={0.8}
      showsVerticalScrollIndicator={false}
      initialNumToRender={15}
      maxToRenderPerBatch={15}
      windowSize={5}
      removeClippedSubviews={true}
      refreshControl={refreshControl ? <RefreshControl {...refreshControl} /> : undefined}
    />
  );
}
