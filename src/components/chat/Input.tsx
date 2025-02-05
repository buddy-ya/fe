import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { Send, Image } from 'lucide-react-native';

interface CommentInputProps {
  value: string;
  leftImage?: ReactNode;
  onChange: (text: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export const Input = ({ value, leftImage, onChange, onSubmit, isLoading }: CommentInputProps) => {
  const { t } = useTranslation('feed');
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View
      className={`w-full flex-row items-center justify-between bg-white px-4 py-[12px] ${
        isFocused ? '' : 'pb-8'
      }`}
    >
      <View className="flex-1 flex-row items-center">
        <View
          className={`flex-row items-center ${leftImage ? 'w-[88%]' : 'w-[97%]'} rounded-[12px] bg-[#F1F1F1]`}
        >
          {leftImage}
          <TextInput
            value={value}
            onChangeText={(text) => {
              onChange(text);
            }}
            placeholder={t('comment.placeholder')}
            className={`max-h-[90px] min-h-[40px] w-full bg-[#F1F1F1] ${leftImage ? 'px-[8px]' : 'px-[16px]'} rounded-[12px] py-2.5 align-middle text-[15px] leading-5`}
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
