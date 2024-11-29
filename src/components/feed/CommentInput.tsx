import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Send } from "lucide-react-native";
import { useTranslation } from "react-i18next";

interface CommentInputProps {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export const CommentInput = ({
  value,
  onChange,
  onSubmit,
  isLoading,
}: CommentInputProps) => {
  const { t } = useTranslation("feed");
  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-t-[0.3px] border-borderBottom bg-white">
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={t("comment.placeholder")}
        className="bg-gray-100 rounded-[12px] px-4 py-3 w-[91%]"
        multiline
        scrollEnabled={true}
        maxLength={500}
        onSubmitEditing={onSubmit}
        style={{
          maxHeight: 84,
          height: "auto",
          fontSize: 15,
        }}
      />
      <TouchableOpacity
        onPress={onSubmit}
        disabled={!value.trim() || isLoading}
      >
        <Send strokeWidth={1.3} color={`#CBCBCB`} />
      </TouchableOpacity>
    </View>
  );
};
