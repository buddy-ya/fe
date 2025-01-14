import { NavigationProp } from '@react-navigation/native';
import LogoIcon from '@assets/icons/logo.svg';
import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { CategoryPager, InnerLayout, Layout, RoomList } from '@/components';
import { Room } from '@/model';


export const CATEGORIES = [
  {
    "id": 1,
    "label": "매칭"
  },
  {
    "id": 2,
    "label": "피드"
  },
]

export default function RoomListScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const [activeIndex, setActiveIndex] = useState(0);

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
  const scrollViewRef = useRef<ScrollView>(null);

  const handleChipPress = (index: number) => {
    setActiveIndex(index);
  }

  const handlePressRoom = (roomId: number) => {
    navigation.navigate('ChatRoom', { roomId })
  }
  return (
    <Layout
      hasTabBar={true}
      showHeader
      headerLeft={<LogoIcon />}
    >
      <InnerLayout>
        <View className='flex-1'>
          <CategoryPager categories={CATEGORIES} onPageChange={handleChipPress}>
            {CATEGORIES.map((category) => (
              <View key={category.id} className="flex-1">
                <RoomList
                  rooms={rooms}
                  onPress={handlePressRoom} />
              </View>
            ))}
          </CategoryPager>
        </View>

      </InnerLayout>
    </Layout>
  );
}
