import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, TextInput, View } from 'react-native';
import { MyText } from '@/components';
import { Pencil } from 'lucide-react-native';

interface MatchProfileProps {
  isEditing: boolean;
  value: string;
  errorMessage?: string;
  onEdit?: () => void;
  onChange: (text: string) => void;
  onSave: () => void;
  questionText: string;
}

const MatchProfile: React.FC<MatchProfileProps> = ({
  isEditing,
  value,
  errorMessage,
  onEdit,
  onChange,
  onSave,
  questionText,
}) => {
  const { t } = useTranslation('mypage');
  return isEditing ? (
    <>
      <View className="mb-4 rounded-xl bg-gray-100 p-4">
        <View>
          <MyText className="font-semibold text-gray-500">{questionText}</MyText>
        </View>
        <View className="mt-[8px] flex-row items-center">
          <TextInput
            autoFocus
            multiline
            className="flex-1 font-medium text-[14px] text-black"
            value={value}
            onChangeText={onChange}
          />
          <TouchableOpacity onPress={onSave} className="p-1">
            <MyText className="text-primary">{t('profile.save')}</MyText>
          </TouchableOpacity>
        </View>
        {errorMessage && <MyText className="mt-3 text-xs text-red-500">{errorMessage}</MyText>}
      </View>
    </>
  ) : (
    <TouchableOpacity activeOpacity={0.8}>
      <View className="mb-4 flex-row items-center justify-between rounded-xl bg-gray-100 p-4">
        <View className="max-w-[90%]">
          <MyText className="font-semibold text-gray-500">{questionText}</MyText>
          <MyText className="mt-[8px] font-medium text-[14px] text-black">{value}</MyText>
        </View>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
            <Pencil size={18} color="#797979" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MatchProfile;
