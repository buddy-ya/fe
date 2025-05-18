import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity } from 'react-native';
import { useUserStore } from '@/store';
import { MyText } from '../common';

type TabKey = 'myUni' | 'buddyya';

interface FeedHeaderTabProps {
  selectedTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export function FeedHeaderTab({ selectedTab, onSelectTab }: FeedHeaderTabProps) {
  const { t } = useTranslation('feed');
  const isFeedActive = useUserStore((state) => state.isFeedActive);

  const tabs: Array<{ key: TabKey; label: string; visible: boolean }> = [
    { key: 'buddyya', label: t('header.buddyya'), visible: true },
    { key: 'myUni', label: t('header.myUni'), visible: isFeedActive || false },
  ];

  return (
    <View className="flex-row items-center">
      {tabs.map(
        ({ key, label, visible }, index) =>
          visible && (
            <TouchableOpacity key={key} onPress={() => onSelectTab(key)} className="">
              <MyText
                size="text-2xl"
                className={`font-semibold ${index === 1 ? 'ml-3' : ''} ${
                  selectedTab === key ? '' : 'text-textLight'
                }`}
              >
                {label}
              </MyText>
            </TouchableOpacity>
          )
      )}
    </View>
  );
}
