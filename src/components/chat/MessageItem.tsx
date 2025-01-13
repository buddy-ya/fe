import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Message } from '@/model';

interface MessageProps {
    message: Message;
    isCurrentUser: boolean;
    shouldShowProfile: boolean;
}

const MessageItem = ({ message, isCurrentUser, shouldShowProfile }: MessageProps) => {

    const computedClassName = isCurrentUser ? '' : shouldShowProfile ? '' : 'ml-[35px]';

    return (
        <>
            <View
                className={`flex-row w-full ${isCurrentUser ? 'justify-end' : 'justify-start'} items-center`}
            >
                {/* 상대방의 메시지에만 프로필 표시 */}
                {shouldShowProfile && !isCurrentUser && (
                    <TouchableOpacity className="profile">
                        <Image
                            source={{ uri: 'https://picsum.photos/150' }}
                            alt={`${message.sender}'s profile`}
                            className="w-10 h-10 rounded-full"
                            width={20}
                            height={20}
                        />
                    </TouchableOpacity>
                )}
                <View className={`flex jusity-center w-24 h-10 bg-red-200 ${computedClassName}`}>
                    <Text>{message.content}</Text>
                </View>
            </View>
        </>
    );
};

export default MessageItem;
