import { forwardRef, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, TextInput, TouchableOpacity, View } from 'react-native';
import { Send, Image } from 'lucide-react-native';

interface CommentInputProps {
  value: string;
  leftImage?: ReactNode;
  placeholder: string;
  maxLength?: number;
  onChange: (text: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const Input = forwardRef<TextInput, CommentInputProps>(
  (
    { value, leftImage, onChange, onSubmit, placeholder, isLoading, disabled, maxLength = 100 },
    ref
  ) => {
    const { t } = useTranslation('feed');
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const isButtonEnabled = !disabled && (value.trim().length > 0 || isLoading);

    return (
      <View
        className={`w-full flex-row items-center justify-between border-t border-borderBottom bg-white px-4 py-[10px] ${
          isFocused ? '' : Platform.OS === 'android' ? 'pb-[10px]' : 'pb-8'
        } ${disabled ? 'opacity-50' : ''}`} // disabled일 경우 opacity 조정(옵션)
      >
        <View className="flex-1 flex-row items-center">
          <View
            className={`flex-row items-center ${leftImage ? 'w-[88%] pl-1' : 'w-[97%]'} rounded-[12px] bg-[#F1F1F1]`}
          >
            {leftImage}

            <TextInput
              ref={ref}
              value={value}
              onChangeText={(text) => {
                onChange(text);
              }}
              placeholder={placeholder}
              className={`max-h-[80px] min-h-[40px] w-full bg-[#F1F1F1] ${leftImage ? 'px-[8px]' : 'px-[16px]'} rounded-[12px] text-[15px] leading-[20px] ${Platform.select({ ios: 'py-2.5', android: 'py-0' })} `}
              multiline={true}
              scrollEnabled={true}
              maxLength={maxLength}
              onSubmitEditing={onSubmit}
              onFocus={handleFocus}
              onBlur={handleBlur}
              textAlignVertical="center"
              editable={!disabled}
              allowFontScaling={false}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={onSubmit}
          className="items-center justify-center"
          disabled={disabled || value.length < 0 || isLoading}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View>
            <Send strokeWidth={1.3} color={isButtonEnabled ? '#00A176' : '#CBCBCB'} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
);
