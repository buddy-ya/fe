import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity } from 'react-native';
import { MyText } from '../common';

type TabKey = 'myUni' | 'buddyya';

interface FeedHeaderTabProps {
  selectedTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export function FeedHeaderTab({ selectedTab, onSelectTab }: FeedHeaderTabProps) {
  const { t } = useTranslation('feed');

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'buddyya', label: t('header.buddyya') },
    { key: 'myUni', label: t('header.myUni') },
  ];

  return (
    <View className="flex-row items-center justify-around">
      {tabs.map(({ key, label }, index) => (
        <TouchableOpacity key={key} onPress={() => onSelectTab(key)}>
          <MyText
            size="text-2xl"
            className={`font-semibold ${index === 1 ? 'ml-3' : ''} ${
              selectedTab === key ? '' : 'text-textLight'
            }`}
          >
            {label}
          </MyText>
        </TouchableOpacity>
      ))}
    </View>
  );
}
