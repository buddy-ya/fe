import { Room } from '@/model';
import { Image, View, TouchableOpacity } from 'react-native';
import { Chip, MyText } from '../common';

interface RoomItemProps {
    room: Room;
    onPress?: (id: number) => void;
}

export default function RoomItem({ room, onPress }: RoomItemProps) {

    const {
        id,
        title,
        content,
        imageUrl,
        unreadCount,
        lastMessageDate
    } = room

    const handleClick = () => {
        onPress?.(id);
    };

    const computedUnreadCount = unreadCount > 999 ? unreadCount.toString().slice(0, 3) + '+' : unreadCount.toString();

    return (
        <TouchableOpacity onPress={handleClick}>
            <View className="flex-row flex-wrap items-center justify-between mt-3 rounded-[13px] w-full h-[60px]">
                <View className='flex-row items-center w-3/4 h-full'>
                    <View>
                        <Image className="w-[49px] h-[49px] rounded-[12px]" source={{ uri: imageUrl }} />
                    </View>
                    <View className='flex justify-between ml-3 w-3/4 h-[40px]'>
                        <MyText numberOfLines={1}>{title}</MyText>
                        <MyText numberOfLines={1} size='text-sm'>{content}</MyText>
                    </View>
                </View>
                <View className='flex justify-between items-end mr-3 w-1/5 h-[38px]'>
                    <MyText size='text-sm'>
                        {lastMessageDate}
                    </MyText>
                    {unreadCount > 0 && <Chip className="py-0 h-[24px] bg-textWarning" label={computedUnreadCount} textClassName='leading-[1.0] text-white' readOnly />}
                </View>
            </View>
        </TouchableOpacity>
    )
}
