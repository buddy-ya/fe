import { useTranslation } from 'react-i18next';
import { RefreshControl, RefreshControlProps } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Room } from '@/types/RoomDTO';
import { EmptyState } from '../common';
import RoomItem from './RoomItem';

interface RoomListProps {
  rooms: Room[];
  onPress: (room: Room) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  className?: string;
  onLoadMore?: () => void;
  refreshControl?: RefreshControlProps | null;
}

export default function RoomList({
  rooms,
  onPress,
  isLoading,
  hasMore,
  className,
  onLoadMore,
  refreshControl,
}: RoomListProps) {
  const { t } = useTranslation('common');

  if (rooms.length === 0) {
    return (
      <EmptyState
        title={t('emptyState.chat.title')}
        description={t('emptyState.chat.description')}
      />
    );
  }
  return (
    <FlatList
      data={rooms}
      renderItem={({ item }) => (
        <RoomItem key={item.id} room={item} onPress={() => onPress(item)} />
      )}
      className={`pt-3 ${className}`}
      contentContainerStyle={{ paddingBottom: 60 }}
      keyExtractor={(item) => `room-${item.id}`}
      onEndReached={hasMore ? onLoadMore : null}
      onEndReachedThreshold={0.8}
      showsVerticalScrollIndicator={false}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
      refreshControl={refreshControl ? <RefreshControl {...refreshControl} /> : undefined}
    />
  );
}
