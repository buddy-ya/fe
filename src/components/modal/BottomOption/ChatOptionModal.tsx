import { feedKeys, FeedRepository } from '@/api';
import MyText from '@/components/common/MyText';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import i18next from 'i18next';
import { Flag, Pencil, Trash2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Alert, Modal, TouchableOpacity, View } from 'react-native';

interface BottomModalProps {
    visible: boolean;
    onClose: () => void;
    feed: any
}

export function ChatOptionModal({
    visible,
    onClose,
    feed,
}: BottomModalProps) {
    const queryClient = useQueryClient();
    const navigation = useNavigation<any>(); // navigation의 타입을 any로 설정

    const { t } = useTranslation('feed');
    const showDeleteAlert = (onConfirm: () => void) => {
        Alert.alert(
            t('delete.title'),
            t('delete.description'),
            [
                { text: t('delete.cancel'), style: 'cancel' },
                { text: t('delete.confirm'), style: 'destructive', onPress: onConfirm },
            ],
            { cancelable: true }
        );
    };

    const options = feed.isFeedOwner ?
        [
            {
                id: 1,
                label: i18next.t('feed:modal.edit'),
                icon: <Pencil size={20} color="#282828" />,
                onPress: () => {
                    navigation.navigate('FeedWrite', {
                        feed,
                        isEdit: true,
                    })
                },
            },
            {
                id: 2,
                label: i18next.t('feed:modal.delete'),
                icon: <Trash2 size={20} color="#282828" />,
                onPress: () => showDeleteAlert(async () => {
                    await FeedRepository.delete({ feedId: feed.id });
                    queryClient.invalidateQueries({ queryKey: feedKeys.all });
                    navigation.goBack();
                    onClose();
                })
            }
        ] :
        [
            {
                id: 3,
                label: i18next.t('feed:modal.report'),
                icon: <Flag size={20} color="#282828" />,
                onPress: () => console.log('report')
            }
        ];

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={onClose}>
                <View className="absolute bottom-8 left-5 right-5 rounded-[20px] bg-white py-0">
                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`py-6 ${index !== 0 && 'border-t'} border-modalBorderBottom`}
                            onPress={() => {
                                option.onPress();
                                onClose();
                            }}
                        >
                            <View className="flex-row items-center justify-center">
                                {option.icon && <View className="mr-2">{option.icon}</View>}
                                <MyText
                                    size="text-[16px]"
                                    className="text-center"
                                    color={'text-[#282828]'}
                                >
                                    {option.label}
                                </MyText>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>
        </Modal>
    );
}
