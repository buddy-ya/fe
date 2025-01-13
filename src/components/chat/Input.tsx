import { Send, Image } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface CommentInputProps {
    value: string;
    onUpload: () => void;
    onChange: (text: string) => void;
    onSubmit: () => void;
    isLoading?: boolean;
}

export const Input = ({ value, onUpload, onChange, onSubmit, isLoading }: CommentInputProps) => {
    const { t } = useTranslation('feed');
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    }

    const handleBlur = () => {
        setIsFocused(false);
    }

    return (
        <View
            className={`flex-row items-center justify-between w-full bg-white px-4 py-[12px] ${isFocused ? '' : 'pb-8'
                }`}
        >
            <View className='flex-row flex-1 items-center'>
                <View className='flex-row items-center w-[88%] rounded-[12px] bg-[#F1F1F1]'>

                    <TouchableOpacity onPress={onUpload}>
                        <View className={`flex-row items-center ml-2 w-[24px] h-[24px]`} >
                            <Image size={24} strokeWidth={1.3} color="#CBCBCB" />
                        </View>
                    </TouchableOpacity>

                    <TextInput
                        value={value}
                        onChangeText={(text) => {
                            onChange(text);
                        }}
                        placeholder={t('comment.placeholder')}
                        className={`w-full bg-[#F1F1F1] max-h-[90px] min-h-[40px] px-[8px] py-2.5 text-[15px] leading-5 align-middle rounded-[12px]`}
                        multiline
                        scrollEnabled={true}
                        maxLength={500}
                        onSubmitEditing={onSubmit}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </View>
            </View>
            <TouchableOpacity
                onPress={onSubmit}
                disabled={value.length < 0 || isLoading}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Send strokeWidth={1.3} color={`#CBCBCB`} />
            </TouchableOpacity>
        </View>
    );
};
