import { useRef, useState } from "react";
import { ImagePickerOptions } from "expo-image-picker";
import { InnerLayout, Input, KeyboardLayout, Layout, MessageList, MyText } from "@/components";
import { EllipsisVertical, ChevronLeft } from "lucide-react-native";
import { TouchableOpacity, ScrollView, Keyboard, RefreshControl, Alert } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { useImageUpload } from "@/hooks";
import { Message } from "@/model";

const IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: false,
  quality: 0.7,
  allowsMultipleSelection: true,
  selectionLimit: 3,
};

const data: Message[] = [
  {
    "id": 1,
    "sender": "other",
    "content": "안녕하세요"
  },
  {
    "id": 2,
    "sender": "other",
    "content": "안녕하세요2"
  },
  {
    "id": 3,
    "sender": "other",
    "content": "안녕하세요3"
  },
  {
    "id": 4,
    "sender": "other",
    "content": "안녕하세요4"
  },
  {
    "id": 5,
    "sender": "me",
    "content": "안녕하세요"
  },
  {
    "id": 6,
    "sender": "me",
    "content": "안녕하세요2"
  },
  {
    "id": 7,
    "sender": "me",
    "content": "안녕하세요3"
  },
  {
    "id": 8,
    "sender": "other",
    "content": "안녕하세요"
  },
  {
    "id": 9,
    "sender": "other",
    "content": "안녕하세요"
  },
  {
    "id": 10,
    "sender": "other",
    "content": "안녕하세요"
  },
  {
    "id": 11,
    "sender": "me",
    "content": "안녕하세요"
  },
  {
    "id": 12,
    "sender": "other",
    "content": "안녕하세요"
  },
  {
    "id": 13,
    "sender": "other",
    "content": "안녕하세요"
  },
  {
    "id": 14,
    "sender": "me",
    "content": "안녕하세요"
  },
  {
    "id": 15,
    "sender": "me",
    "content": "안녕하세요"
  },
  {
    "id": 16,
    "sender": "other",
    "content": "안녕하세요"
  },
  {
    "id": 17,
    "sender": "other",
    "content": "안녕하세요"
  },
  {
    "id": 18,
    "sender": "other",
    "content": "안녕하세요"
  },
  {
    "id": 19,
    "sender": "other",
    "content": "안녕하세요"
  },
  {
    "id": 20,
    "sender": "other",
    "content": "안녕하세요"
  },
];

export default function ChatRoomScreen({ navigation }: { navigation: NavigationProp<any> }) {

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
        <InnerLayout>
          <MessageList messages={data} currentUser={"me"} />
        </InnerLayout>
      </KeyboardLayout>

    </Layout>
  );
}
