import { Room } from '@/model';
import { RefreshControl, RefreshControlProps } from 'react-native';
import { EmptyState } from '../common';
import { FlatList } from 'react-native-gesture-handler';
import RoomItem from './RoomItem';

interface RoomListProps {
    rooms: Room[];
    onPress: (id: number) => void;
    isLoading?: boolean;
    hasMore?: boolean;
    className?: string;
    onLoadMore?: () => void;
    refreshControl?: RefreshControlProps | null;
    emptyStateMessage?: string;
    showBookmarkButton?: boolean;
    disableActions?: boolean;
}

export default function RoomList({
    rooms,
    onPress,
    isLoading,
    hasMore,
    className,
    onLoadMore,
    refreshControl,
    emptyStateMessage,
    showBookmarkButton,
    disableActions
}: RoomListProps) {

    if (rooms.length === 0) {
        return <EmptyState message={emptyStateMessage || '채팅이 없습니다.'} />
    }
    return (
        <FlatList
            data={rooms}
            renderItem={({ item }) => (
                <RoomItem
                    key={item.id}
                    room={item}
                    onPress={() => onPress(item.id)}
                />
            )}
            className={`mt-1 pt-3 ${className}`}
            contentContainerStyle={{ paddingBottom: 60 }}
            keyExtractor={(item) => `feed-${item.id}`}
            onEndReached={hasMore ? onLoadMore : null}
            onEndReachedThreshold={0.8}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews={true}
            refreshControl={refreshControl ? <RefreshControl {...refreshControl} /> : undefined}

        />

    )
}
