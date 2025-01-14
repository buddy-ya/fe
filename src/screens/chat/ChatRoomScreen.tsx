import { useEffect, useRef } from "react";
import { ImagePickerOptions } from "expo-image-picker";
import { InnerLayout, Input, KeyboardLayout, Layout, MessageItem, MyText } from "@/components";
import { EllipsisVertical, ChevronLeft } from "lucide-react-native";
import { TouchableOpacity, FlatList } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { useImageUpload } from "@/hooks";
import { Message } from "@/model";
import { useMessageStore } from "@/store";
import { useRoomStore } from "@/store/useRoomStore";

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

const ChatRoomScreen = (navigation: NavigationProp<any>) => {

  const { handleUpload, loading } = useImageUpload({ options: IMAGE_PICKER_OPTIONS });
  const { text, messages, isLoading, error, handleChange, handleSubmit, setMessage, addMessage, deleteMessage } = useMessageStore();
  const flatListRef = useRef<FlatList>(null);
  const title = useRoomStore(state => state.title);

  // TODO: 추후에 알림 등으로 바로 들어온 경우 뒤로가기 스택이 없으므로 룸리스트로 보내게끔 해야 할 듯
  const handleBack = () => {
    navigation.goBack();
  }

  const onSubmit = () => {
    handleSubmit();
  }

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 0);
  }, [messages]);

  useEffect(() => {
    setMessage(data);
  }, []);

  return (
    <Layout
      showHeader
      isBackgroundWhite
      headerLeft={<TouchableOpacity
        onPress={handleBack}
        className="flex-row items-center"
        hitSlop={{ right: 20 }}
      >
        <ChevronLeft strokeWidth={2} size={30} color="#797979" />
      </TouchableOpacity>}
      headerCenter={<MyText size="text-lg" className="font-semibold">{title}</MyText>}
      headerRight={
        <TouchableOpacity>
          <EllipsisVertical strokeWidth={2} size={24} color="#797979" />
        </TouchableOpacity>
      }
    >
      <KeyboardLayout footer={<Input value={text} onUpload={handleUpload} onChange={handleChange} onSubmit={onSubmit} />}>
        <InnerLayout>
          {/* TODO: FlatList에서 ref 전달 관련 타입 에러가 있어서 일단 끌어올림. */}
          <FlatList
            data={messages}
            renderItem={({ item, index }) => (
              <MessageItem
                key={item.id}
                message={item}
                isCurrentUser={item.sender === "me"}
                shouldShowProfile={(index === 0 && item.sender !== "me") || (index > 0 && messages[index - 1].sender !== item.sender) && item.sender !== "me"}
              />
            )}
            ref={flatListRef}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })} // 안전하게 current에 접근
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })} // 안전하게 current에 접근

          />
        </InnerLayout>
      </KeyboardLayout>

    </Layout>
  );
}

export default ChatRoomScreen;