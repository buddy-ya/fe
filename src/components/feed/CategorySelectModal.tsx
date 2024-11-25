import { CATEGORIES } from "@/utils/constants/categories";
import { Check } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import MyText from "../common/MyText";

interface CategorySelectModalProps {
  selectedCategory: (typeof CATEGORIES)[0];
  onSelect: (category: (typeof CATEGORIES)[0]) => void;
}

export function CategorySelectModal({
  selectedCategory,
  onSelect,
}: CategorySelectModalProps) {
  return (
    <View className="p-8 pb-6">
      <MyText size="text-xl" className="font-semibold mb-9">
        게시판을 선택하세요.
      </MyText>
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category.id}
          className="flex-row items-center justify-between py-3"
          onPress={() => onSelect(category)}
        >
          <View className="flex-row mb-1 items-center">
            <View className="mr-3">
              <MyText>{category.icon}</MyText>
            </View>
            <MyText
              size="text-[16px]"
              color={`text-textDescription ${
                selectedCategory.id == category.id && "text-[#004835]"
              }`}
              className="font-semibold"
            >
              {category.label}
            </MyText>
          </View>
          <MyText>
            {category.id === selectedCategory.id && (
              <Check size={20} strokeWidth={2} color="#00A176" />
            )}
          </MyText>
        </TouchableOpacity>
      ))}
    </View>
  );
}
