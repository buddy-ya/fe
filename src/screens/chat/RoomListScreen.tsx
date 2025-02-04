import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { RoomRepository } from '@/api';
import { InnerLayout, Layout, MyText, RoomList } from '@/components';
import { ChatStackParamList, FeedStackParamList } from '@/navigation/navigationRef';
import { Room } from '@/types/RoomDTO';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSuspenseQuery } from '@tanstack/react-query';
import { UserRoundPlus, Check } from 'lucide-react-native';

type RoomListNavigationProps = NativeStackScreenProps<
  ChatStackParamList & FeedStackParamList,
  'RoomList'
>;

export default function RoomListScreen({ navigation }: RoomListNavigationProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  // TODO: 스크롤 등 했을때 다시 불러오는 로직 필요
  const { data } = useSuspenseQuery({
    queryKey: ['roomList'],
    queryFn: RoomRepository.getRoomList,
  });

  const handleChipPress = (index: number) => {
    setActiveIndex(index);
  };

  const handleGoToFeed = () => {
    // navigation.navigate('FeedStack', { screen: 'FeedHome' });
  };

  const handlePressRoom = (room: Room) => {
    navigation.navigate('ChatRoom', { ...room });
  };

  return (
    <Layout
      isBackgroundWhite
      showHeader
      headerLeft={
        <View className="p-2">
          <MyText className="font-bold" size="text-[22px]" color="text-[#282828]">
            채팅
          </MyText>
        </View>
      }
      headerRight={
        <TouchableOpacity className="p-2">
          <UserRoundPlus strokeWidth={2} size={24} color={'#797979'} />
        </TouchableOpacity>
      }
    >
      <InnerLayout>
        <View className="flex-1">
          <View className="flex h-[77px] flex-row items-center justify-between rounded-xl bg-primary px-6 py-4">
            <View className="flex h-full flex-1 flex-row items-center">
              <MyText className="text-white" size="text-lg">
                더 많은 글로벌 버디와 친구가 되고 싶다면?
              </MyText>
            </View>
            <View className="mt-6 flex h-full flex-1 flex-row items-center justify-end">
              <TouchableOpacity onPress={handleGoToFeed}>
                <MyText className="text-white" size="text-sm">
                  {'피드 둘러보기 >'}
                </MyText>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-1">
            <RoomList rooms={data} onPress={handlePressRoom} />
          </View>
        </View>
      </InnerLayout>
    </Layout>
  );
}
