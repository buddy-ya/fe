import { Fragment, useState } from 'react';
import { View, Text } from 'react-native';
import { ChatPaper, InnerLayout, Layout, RoomList } from '@/components';
import { Room } from '@/model';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChatStackParamList } from '@/navigation/navigationRef';

export const CATEGORIES = [
  {
    "id": 1,
    "label": "피드"
  },
  {
    "id": 2,
    "label": "매칭"
  },
]


const rooms: Room[] = [
  {
    id: 1,
    title: "방1",
    content: "hello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello world",
    imageUrl: "https://via.placeholder.com/150",
    unreadCount: 123,
    lastMessageDate: "2022-10-10"
  },
  {
    id: 2,
    title: "방2",
    content: "hello world",
    imageUrl: "https://via.placeholder.com/150",
    unreadCount: 3,
    lastMessageDate: "2022-10-10"
  },
  {
    id: 3,
    title: "방3",
    content: "hello world",
    imageUrl: "https://via.placeholder.com/150",
    unreadCount: 0,
    lastMessageDate: "2022-10-10"
  },
  {
    id: 4,
    title: "방4",
    content: "hello world",
    imageUrl: "https://via.placeholder.com/150",
    unreadCount: 3,
    lastMessageDate: "2022-10-10"
  },
  {
    id: 5,
    title: "방5",
    content: "hello world",
    imageUrl: "https://via.placeholder.com/150",
    unreadCount: 9999,
    lastMessageDate: "2022-10-10"
  },
  {
    id: 6,
    title: "방6",
    content: "hello world",
    imageUrl: "https://via.placeholder.com/150",
    unreadCount: 9999,
    lastMessageDate: "2022-10-10"
  },
  {
    id: 7,
    title: "방7",
    content: "hello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello world",
    imageUrl: "https://via.placeholder.com/150",
    unreadCount: 123,
    lastMessageDate: "2022-10-10"
  },
  {
    id: 8,
    title: "방8",
    content: "hello world",
    imageUrl: "https://via.placeholder.com/150",
    unreadCount: 3,
    lastMessageDate: "2022-10-10"
  },
  {
    id: 9,
    title: "방9",
    content: "hello world",
    imageUrl: "https://via.placeholder.com/150",
    unreadCount: 0,
    lastMessageDate: "2022-10-10"
  },
  {
    id: 10,
    title: "방10",
    content: "hello world",
    imageUrl: "https://via.placeholder.com/150",
    unreadCount: 3,
    lastMessageDate: "2022-10-10"
  },
  {
    id: 11,
    title: "방11",
    content: "hello world",
    imageUrl: "https://via.placeholder.com/150",
    unreadCount: 9999,
    lastMessageDate: "2022-10-10"
  },
  {
    id: 12,
    title: "방12",
    content: "hello world",
    imageUrl: "https://via.placeholder.com/150",
    unreadCount: 9999,
    lastMessageDate: "2022-10-10"
  }
]

type RoomListNavigationProps = NativeStackScreenProps<ChatStackParamList, 'RoomList'>;

export default function RoomListScreen({ navigation }: RoomListNavigationProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleChipPress = (index: number) => {
    setActiveIndex(index);
  }

  const handlePressRoom = (room: Room) => {
    navigation.navigate('ChatRoom', { ...room })
  }

  return (
    <Layout isBackgroundWhite>
      <InnerLayout>
        <View className='flex-1'>
          <ChatPaper categories={CATEGORIES} onPageChange={handleChipPress}>
            {CATEGORIES.map((category) => (
              <Fragment key={`fragment_${category.id}`}>
                <View className='flex items-center justify-center bg-primary h-[77px] rounded-xl'>
                  <Text className='text-base text-white'>더 많은 글로벌 버디와 친구가 되고 싶다면?</Text>
                </View>
                <View className="flex-1">
                  <RoomList
                    rooms={rooms}
                    onPress={handlePressRoom}
                  />
                </View>
              </Fragment>
            ))}
          </ChatPaper>
        </View>

      </InnerLayout>
    </Layout>
  );
}
