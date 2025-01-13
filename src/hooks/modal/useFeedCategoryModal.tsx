import { useState } from 'react';
import { View } from 'react-native';
import { useModal } from '@/hooks';
import { CATEGORIES } from '@/utils/constants/categories';

const FILTERED_CATEGORIES = CATEGORIES.filter((category) => category.id !== 'popular');

interface UseFeedCategoryModalProps {
  initialCategory?: (typeof CATEGORIES)[0];
}

export const useFeedCategoryModal = ({
  initialCategory = FILTERED_CATEGORIES[0],
}: UseFeedCategoryModalProps = {}) => {
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || FILTERED_CATEGORIES[0]
  );

  const categoryModal = useModal();

  const handleCategorySelect = (category: (typeof CATEGORIES)[0]) => {
    setSelectedCategory(category);
    categoryModal.closeModal();
  };

  const handleOpenCategoryModal = () => {
    const options = FILTERED_CATEGORIES.map((category) => ({
      label: `${category.icon} ${category.label}`,
      onPress: () => handleCategorySelect(category),
      color: category.id === selectedCategory.id ? 'text-textActive' : '#797979',
      icon:
        category.id === selectedCategory.id ? (
          <View className="h-4 w-4 rounded-full bg-primary" />
        ) : (
          <View className="h-4 w-4 rounded-full border border-gray-300" />
        ),
    }));

    categoryModal.openModal(options);
  };

  return {
    selectedCategory,
    categoryModal,
    handleOpenCategoryModal,
  };
};
