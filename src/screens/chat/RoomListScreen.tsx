import { RoomRepository } from '@/api';
import { ChatPaper, InnerLayout, Layout, RoomList } from '@/components';
import { Room } from '@/model';
import { NavigationProp } from '@react-navigation/native';
import { useSuspenseQuery } from '@tanstack/react-query';
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

export default function RoomListScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const [activeIndex, setActiveIndex] = useState(0);
  // TODO: 스크롤 등 했을때 다시 불러오는 로직 필요
  const { data } = useSuspenseQuery({
    queryKey: ['roomList'],
    queryFn: RoomRepository.getRoomList,
  });

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
                  <RoomList rooms={data} onPress={handlePressRoom} />
                </View>
              </Fragment>
            ))}
          </ChatPaper>
        </View>
      </InnerLayout>
    </Layout>
  );
}
