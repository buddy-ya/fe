import { useRef, useState } from "react";
import { ImagePickerOptions } from "expo-image-picker";
import { Input, KeyboardLayout, Layout, MyText } from "@/components";
import { EllipsisVertical, ChevronLeft } from "lucide-react-native";
import { Text, TouchableOpacity, ScrollView, Keyboard, RefreshControl, Alert } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { useImageUpload } from "@/hooks";

const IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: false,
  quality: 0.7,
  allowsMultipleSelection: true,
  selectionLimit: 3,
};

export default function ChatScreen({ navigation }: { navigation: NavigationProp<any> }) {

  const scrollViewRef = useRef<ScrollView>(null);

  // TODO: 추후에 알림 등으로 바로 들어온 경우 뒤로가기 스택이 없으므로 룸리스트로 보내게끔 해야 할 듯
  const handleBack = () => {
    navigation.goBack();
  }

  const [messages, setMessages] = useState('');
  const { images, handleUpload, removeImage, loading } = useImageUpload({ options: IMAGE_PICKER_OPTIONS });

  const handleChange = (text: string) => {
    setMessages(text);
  }

  const handleSubmit = async () => {
    if (messages === '') {
      return;
    }

    console.log('send message:', messages);
    setMessages('');
    Keyboard.dismiss();
  }

  console.log('images', images);

  return (
    <Layout
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
      <KeyboardLayout footer={<Input value={messages} onUpload={handleUpload} onChange={handleChange} onSubmit={handleSubmit} />}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="mt-1"
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => console.log('refresh')}
              tintColor="#4AA366"
            />
          }
        >
          <Text>Chat Screen</Text>
        </ScrollView>
      </KeyboardLayout>

    </Layout>
  );
}
