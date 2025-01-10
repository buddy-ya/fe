import { useRef } from "react";
import { InnerLayout, Layout, MyText } from "@/components";
import { EllipsisVertical, ChevronLeft } from "lucide-react-native";
import { Text, TouchableOpacity, ScrollView } from "react-native";

export default function ChatScreen({ navigation }) {

  const scrollViewRef = useRef<ScrollView>(null);

  // TODO: 추후에 알림 등으로 바로 들어온 경우 뒤로가기 스택이 없으므로 룸리스트로 보내게끔 해야 할 듯
  const handleBack = () => {
    navigation.goBack();
  }

  return (
    <Layout
      hasTabBar={true}
      showHeader
      headerLeft={<TouchableOpacity
        onPress={handleBack}
        className="relative right-2 flex-row items-center"
        hitSlop={{ right: 20 }}
      >
        <ChevronLeft strokeWidth={2} size={30} color="#797979" />
      </TouchableOpacity>}
      headerCenter={<MyText size="text-lg" className="font-semibold">채팅방 제목</MyText>}
      headerRight={
        <TouchableOpacity>
          <EllipsisVertical strokeWidth={2} size={24} color="#797979" />
        </TouchableOpacity>
      }
    >
      <InnerLayout>
        <Text>Chat Screen</Text>
      </InnerLayout>

    </Layout>
  );
}
