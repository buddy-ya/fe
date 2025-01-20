import MyText from '@/components/common/MyText';
import { CATEGORIES } from '@/utils';
import { Check } from 'lucide-react-native';
import { Modal, TouchableOpacity, View } from 'react-native';

interface CategorySelectModalProps {
    visible: boolean;
    onClose: () => void;
    selectedCategory: any;
    onSelect: any;
}

export function CategorySelectModal({
    visible,
    onClose,
    selectedCategory,
    onSelect
}: CategorySelectModalProps) {

    const categories = CATEGORIES.filter((category) => category.id !== 'popular');

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={onClose}>
                <View className="absolute bottom-8 left-5 right-5 rounded-[20px] bg-white py-0">
                    <View className="p-7 pb-6">
                        <MyText size="text-[20px]" className="mb-9 font-semibold">
                            게시판을 선택하세요.
                        </MyText>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                className="flex-row items-center justify-between py-3"
                                onPress={() => onSelect(category)}
                            >
                                <View className="mb-1 flex-row items-center">
                                    <View className="mr-3">
                                        <MyText>{category.icon}</MyText>
                                    </View>
                                    <MyText
                                        size="text-[16px]"
                                        color={`${selectedCategory.id == category.id ? 'text-[#004835]' : 'text-textDescription'
                                            } `}
                                        className="font-semibold"
                                    >
                                        {category.label}
                                    </MyText>
                                </View>
                                <MyText>
                                    {category.id === selectedCategory.id && (
                                        <Check size={20} strokeWidth={2.2} color="#00A176" />
                                    )}
                                </MyText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}
