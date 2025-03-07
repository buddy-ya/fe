import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Modal, TouchableOpacity, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { CATEGORIES } from '@/utils';
import MyText from '@/components/common/MyText';

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
  onSelect,
}: CategorySelectModalProps) {
  const { t } = useTranslation('feed');
  const categories = CATEGORIES.filter((category) => category.id !== 'popular');

  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(500);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 100,
        stiffness: 200,
        overshootClamping: true,
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={onClose}>
        <Animated.View
          style={{ transform: [{ translateY: slideAnim }] }}
          className="absolute bottom-8 left-5 right-5 rounded-[20px] bg-white py-0"
        >
          <View className="p-6 pb-5">
            <MyText size="text-[19px]" className="mb-5 font-semibold">
              {t('write.categoryModalTitle')}
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
                    size="text-lg"
                    color={`${
                      selectedCategory.id == category.id ? 'text-[#004835]' : 'text-textDescription'
                    }`}
                    className="font-semibold"
                  >
                    {t(`category.${category.id}`)}
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
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
