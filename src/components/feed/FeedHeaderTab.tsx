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
    <View className="flex-row items-center justify-around">
      <TouchableOpacity onPress={() => onSelectTab('myUni')}>
        <MyText
          size="text-2xl"
          className={`font-semibold ${selectedTab === 'myUni' ? '' : 'text-textLight'}`}
        >
          {t('header.myUni')}
        </MyText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelectTab('buddyya')}>
        <MyText
          size="text-2xl"
          className={`ml-4 font-semibold ${selectedTab === 'buddyya' ? '' : 'text-textLight'}`}
        >
          {t('header.buddyya')}
        </MyText>
      </TouchableOpacity>
    </View>
  );
}
