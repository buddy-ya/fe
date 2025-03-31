import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity } from 'react-native';
import { MyText } from '../common';

interface FeedHeaderTabProps {
  selectedTab: 'myUni' | 'buddyya';
  onSelectTab: (tab: 'myUni' | 'buddyya') => void;
}

export function FeedHeaderTab({ selectedTab, onSelectTab }: FeedHeaderTabProps) {
  const { t } = useTranslation('feed');

  return (
    <View className="mt-2 flex-row items-center justify-around">
      <TouchableOpacity onPress={() => onSelectTab('myUni')}>
        <MyText
          size="text-[20px]"
          className={`font-semibold ${selectedTab === 'myUni' ? 'text-primary' : 'text-textLight'}`}
        >
          {t('header.myUni')}
        </MyText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelectTab('buddyya')}>
        <MyText
          size="text-[20px]"
          className={`ml-4 font-semibold ${
            selectedTab === 'buddyya' ? 'text-primary' : 'text-textLight'
          }`}
        >
          {t('header.buddyya')}
        </MyText>
      </TouchableOpacity>
    </View>
  );
}
