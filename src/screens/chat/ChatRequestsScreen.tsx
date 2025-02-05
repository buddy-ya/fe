import { TouchableOpacity, View } from 'react-native';
import { InnerLayout, Layout, MyText } from '@/components';
import { ChatStackParamList } from '@/navigation/navigationRef';
import { Room } from '@/types/RoomDTO';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';
import RequestList from '@/components/chat/RequestList';

type ChatRequestsNavigationProps = NativeStackScreenProps<ChatStackParamList, 'ChatRequests'>;

export const chatRequests = [
  {
    id: 1,
    senderId: 101,
    university: 'Harvard University',
    name: 'John Doe',
    country: 'USA',
    profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    createdDate: '2024-02-05T12:00:00Z',
  },
  {
    id: 2,
    senderId: 102,
    university: 'Stanford University',
    name: 'Alice Smith',
    country: 'USA',
    profileImageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    createdDate: '2024-02-05T12:05:00Z',
  },
  {
    id: 3,
    senderId: 103,
    university: 'University of Oxford',
    name: 'Robert Johnson',
    country: 'UK',
    profileImageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    createdDate: '2024-02-05T12:10:00Z',
  },
  {
    id: 4,
    senderId: 104,
    university: 'MIT',
    name: 'Emily Davis',
    country: 'USA',
    profileImageUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
    createdDate: '2024-02-05T12:15:00Z',
  },
  {
    id: 5,
    senderId: 105,
    university: 'University of Cambridge',
    name: 'Michael Brown',
    country: 'UK',
    profileImageUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
    createdDate: '2024-02-05T12:20:00Z',
  },
  {
    id: 6,
    senderId: 106,
    university: 'Yale University',
    name: 'Sophia Wilson',
    country: 'USA',
    profileImageUrl: 'https://randomuser.me/api/portraits/women/6.jpg',
    createdDate: '2024-02-05T12:25:00Z',
  },
  {
    id: 7,
    senderId: 107,
    university: 'Seoul National University',
    name: 'Minho Kim',
    country: 'South Korea',
    profileImageUrl: 'https://randomuser.me/api/portraits/men/7.jpg',
    createdDate: '2024-02-05T12:30:00Z',
  },
  {
    id: 8,
    senderId: 108,
    university: 'National University of Singapore',
    name: 'Wei Zhang',
    country: 'Singapore',
    profileImageUrl: 'https://randomuser.me/api/portraits/women/8.jpg',
    createdDate: '2024-02-05T12:35:00Z',
  },
  {
    id: 9,
    senderId: 109,
    university: 'University of Tokyo',
    name: 'Taro Yamada',
    country: 'Japan',
    profileImageUrl: 'https://randomuser.me/api/portraits/men/9.jpg',
    createdDate: '2024-02-05T12:40:00Z',
  },
  {
    id: 10,
    senderId: 110,
    university: 'ETH Zurich',
    name: 'Anna Müller',
    country: 'Switzerland',
    profileImageUrl: 'https://randomuser.me/api/portraits/women/10.jpg',
    createdDate: '2024-02-05T12:45:00Z',
  },
];

export default function ChatRequestsScreen({ navigation }: ChatRequestsNavigationProps) {
  const handleBack = () => {
    navigation.goBack();
  };

  const handlePressRoom = (room: Room) => {
    navigation.goBack();
  };

  return (
    <Layout
      isBackgroundWhite
      showHeader
      headerLeft={
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={handleBack}
        >
          <ChevronLeft size={30} color={'#797979'} strokeWidth={2} />
        </TouchableOpacity>
      }
      headerCenter={
        <MyText size="text-lg" className="font-bold" color="text-[#282828]">
          받은 요청
        </MyText>
      }
    >
      <InnerLayout>
        <View className="flex-1">
          <View className="flex h-[30px] flex-row items-center justify-between rounded-lg bg-[#DFDFDF]">
            <View className="flex h-full flex-1 flex-row items-center justify-center">
              <MyText size="text-sm" color="text-[#636363]">
                요청은 24시간이 지나면 사라집니다.
              </MyText>
            </View>
          </View>
          <View className="flex-1">
            <RequestList requests={chatRequests} />
          </View>
        </View>
      </InnerLayout>
    </Layout>
  );
}
