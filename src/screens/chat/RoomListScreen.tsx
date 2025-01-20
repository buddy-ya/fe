import { ChatPaper, InnerLayout, Layout, RoomList } from '@/components';
import { Room } from '@/model';
import { Fragment, useState } from 'react';
import { Text, View } from 'react-native';

export const CATEGORIES = [
  {
    id: 1,
    label: '피드',
  },
  {
    id: 2,
    label: '매칭',
  },
];

const rooms: Room[] = [
  {
    id: 1,
    name: '방1',
    lastMessage:
      'hello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello world',
    profileImageUrl: 'https://via.placeholder.com/150',
    unreadCount: 123,
    lastMessageDate: '2022-10-10',
  },
  {
    id: 2,
    name: '방2',
    lastMessage: 'hello world',
    profileImageUrl: 'https://via.placeholder.com/150',
    unreadCount: 3,
    lastMessageDate: '2022-10-10',
  },
  {
    id: 3,
    name: '방3',
    lastMessage: 'hello world',
    profileImageUrl: 'https://via.placeholder.com/150',
    unreadCount: 0,
    lastMessageDate: '2022-10-10',
  },
  {
    id: 4,
    name: '방4',
    lastMessage: 'hello world',
    profileImageUrl: 'https://via.placeholder.com/150',
    unreadCount: 3,
    lastMessageDate: '2022-10-10',
  },
  {
    id: 5,
    name: '방5',
    lastMessage: 'hello world',
    profileImageUrl: 'https://via.placeholder.com/150',
    unreadCount: 9999,
    lastMessageDate: '2022-10-10',
  },
  {
    id: 6,
    name: '방6',
    lastMessage: 'hello world',
    profileImageUrl: 'https://via.placeholder.com/150',
    unreadCount: 9999,
    lastMessageDate: '2022-10-10',
  },
  {
    id: 7,
    name: '방7',
    lastMessage:
      'hello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello world',
    profileImageUrl: 'https://via.placeholder.com/150',
    unreadCount: 123,
    lastMessageDate: '2022-10-10',
  },
  {
    id: 8,
    name: '방8',
    lastMessage: 'hello world',
    profileImageUrl: 'https://via.placeholder.com/150',
    unreadCount: 3,
    lastMessageDate: '2022-10-10',
  },
  {
    id: 9,
    name: '방9',
    lastMessage: 'hello world',
    profileImageUrl: 'https://via.placeholder.com/150',
    unreadCount: 0,
    lastMessageDate: '2022-10-10',
  },
  {
    id: 10,
    name: '방10',
    lastMessage: 'hello world',
    profileImageUrl: 'https://via.placeholder.com/150',
    unreadCount: 3,
    lastMessageDate: '2022-10-10',
  },
  {
    id: 11,
    name: '방11',
    lastMessage: 'hello world',
    profileImageUrl: 'https://via.placeholder.com/150',
    unreadCount: 9999,
    lastMessageDate: '2022-10-10',
  },
  {
    id: 12,
    name: '방12',
    lastMessage: 'hello world',
    profileImageUrl: 'https://via.placeholder.com/150',
    unreadCount: 9999,
    lastMessageDate: '2022-10-10',
  },
];

export default function RoomListScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleChipPress = (index: number) => {
    setActiveIndex(index);
  };

  const handlePressRoom = (room: Room) => {
    navigation.navigate('ChatRoom', { ...room });
  };

  return (
    <Layout isBackgroundWhite>
      <InnerLayout>
        <View className="flex-1">
          <ChatPaper categories={CATEGORIES} onPageChange={handleChipPress}>
            {CATEGORIES.map((category) => (
              <Fragment key={`fragment_${category.id}`}>
                <View className="flex h-[77px] items-center justify-center rounded-xl bg-primary">
                  <Text className="text-base text-white">
                    더 많은 글로벌 버디와 친구가 되고 싶다면?
                  </Text>
                </View>
                <View className="flex-1">
                  <RoomList rooms={rooms} onPress={handlePressRoom} />
                </View>
              </Fragment>
            ))}
          </ChatPaper>
        </View>
      </InnerLayout>
    </Layout>
  );
}
