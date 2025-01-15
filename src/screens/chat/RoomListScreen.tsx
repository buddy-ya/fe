import { NavigationProp } from '@react-navigation/native';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { ChatPaper, InnerLayout, Layout, RoomList } from '@/components';
import { Room } from '@/model';
import { useRoomStore } from '@/store/useRoomStore';


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

export default function RoomListScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const setRoom = useRoomStore(state => state.setRoom);

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
      title: "방5",
      content: "hello world",
      imageUrl: "https://via.placeholder.com/150",
      unreadCount: 9999,
      lastMessageDate: "2022-10-10"
    },
    {
      id: 7,
      title: "방1",
      content: "hello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello world",
      imageUrl: "https://via.placeholder.com/150",
      unreadCount: 123,
      lastMessageDate: "2022-10-10"
    },
    {
      id: 8,
      title: "방2",
      content: "hello world",
      imageUrl: "https://via.placeholder.com/150",
      unreadCount: 3,
      lastMessageDate: "2022-10-10"
    },
    {
      id: 9,
      title: "방3",
      content: "hello world",
      imageUrl: "https://via.placeholder.com/150",
      unreadCount: 0,
      lastMessageDate: "2022-10-10"
    },
    {
      id: 10,
      title: "방4",
      content: "hello world",
      imageUrl: "https://via.placeholder.com/150",
      unreadCount: 3,
      lastMessageDate: "2022-10-10"
    },
    {
      id: 11,
      title: "방5",
      content: "hello world",
      imageUrl: "https://via.placeholder.com/150",
      unreadCount: 9999,
      lastMessageDate: "2022-10-10"
    },
    {
      id: 12,
      title: "방5",
      content: "hello world",
      imageUrl: "https://via.placeholder.com/150",
      unreadCount: 9999,
      lastMessageDate: "2022-10-10"
    }
  ]

  const handleChipPress = (index: number) => {
    setActiveIndex(index);
  }

  const handlePressRoom = (room: Room) => {
    setRoom(room);
    navigation.navigate('ChatRoom', { roomId: room.id })
  }

  return (
    <Layout isBackgroundWhite>
      <InnerLayout>
        <View className='flex-1'>
          <ChatPaper categories={CATEGORIES} onPageChange={handleChipPress}>
            {CATEGORIES.map((category) => (
              <>
                <View key={category.label} className='flex items-center justify-center bg-primary h-[77px] rounded-xl'>
                  <Text className='text-base text-white'>더 많은 글로벌 버디와 친구가 되고 싶다면?</Text>
                </View>
                <View key={category.id} className="flex-1">
                  <RoomList
                    rooms={rooms}
                    onPress={handlePressRoom} />
                </View></>
            ))}
          </ChatPaper>
        </View>

      </InnerLayout>
    </Layout>
  );
}
