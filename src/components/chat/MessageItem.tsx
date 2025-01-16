import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Message } from '@/model';

interface MessageProps {
    message: Message;
    isCurrentUser: boolean;
    shouldShowProfile: boolean;
    profileImageUrl: string;
}

const MessageItem = ({ message, isCurrentUser, shouldShowProfile, profileImageUrl }: MessageProps) => {

    const computedClassName = () => {
        if (isCurrentUser) {
            return 'bg-primary rounded-br-xl rounded-bl-xl rounded-tl-xl ';
        }
        else {
            let className = 'bg-natural rounded-tr-xl rounded-br-xl rounded-bl-xl';
            if (shouldShowProfile) {
                return `ml-[10px] ${className}`;
            }
            else {
                return `ml-[45px] ${className}`
            }
        }
    }

    const computedFontClassName = () => {
        if (isCurrentUser) {
            return 'text-white'
        }
        else {
            let className = 'bg-natural rounded-tr-xl rounded-br-xl rounded-bl-xl';
            if (shouldShowProfile) {
                return `${className}`;
            }
            else {
                return `${className}`;
            }
        }
    }
    return (
        <>
            <View
                className={`flex-row w-full ${isCurrentUser ? 'justify-end' : 'justify-start'} items-center`}
            >
                {/* 상대방의 메시지에만 프로필 표시 */}
                {shouldShowProfile && !isCurrentUser && (
                    <TouchableOpacity>
                        <Image
                            source={{ uri: profileImageUrl }}
                            alt={`${message.sender}'s profile`}
                            className="rounded-full"
                            width={34}
                            height={34}
                        />
                    </TouchableOpacity>
                )}
                <View className={`flex-row items-center jusity-center mt-1 max-w-[70%] min-h-[36px] max-h-[150px] ${computedClassName()}`}>
                    <Text className={`p-2.5 ${computedFontClassName()}`}>{message.content}</Text>
                </View>
            </View>
        </>
    );
};

export default MessageItem;
