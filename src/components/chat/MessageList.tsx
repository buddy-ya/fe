import { View, Text } from 'react-native';
import { Message } from '@/model';
import { FlatList } from 'react-native-gesture-handler';
import MessageItem from './MessageItem';

interface MessageListProps {
    messages: Message[];
    currentUser: string; // 현재 로그인한 사용자 ID
}

const MessageList = ({ messages, currentUser }: MessageListProps) => {

    if (messages.length === 0) {
        return (
            <View className="flex justify-center items-center h-full">
                <Text className="text-gray-500">메시지가 없습니다.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={messages}
            renderItem={({ item, index }) => (
                <MessageItem key={item.id}
                    message={item}
                    isCurrentUser={item.sender === currentUser}
                    shouldShowProfile={(index === 0 && item.sender !== currentUser) || (index > 0 && messages[index - 1].sender !== item.sender) && item.sender !== currentUser}
                />


            )}
            contentContainerStyle={{ paddingVertical: 20 }}
            showsVerticalScrollIndicator={false}
        />
    )
};

export default MessageList;
