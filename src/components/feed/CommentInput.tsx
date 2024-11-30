import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Send } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`flex-row items-center justify-between px-4 py-[12px] border-t-[0.3px] border-borderBottom bg-white ${
        isFocused ? "" : "pb-8"
      }`}
    >
      <TextInput
        value={value}
        onChangeText={(text) => {
          onChange(text);
        }}
        placeholder={t("comment.placeholder")}
        className="bg-[#F1F1F1] rounded-[12px] w-[91%]"
        multiline
        scrollEnabled={true}
        maxLength={500}
        onSubmitEditing={onSubmit}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          maxHeight: 90,
          height: "auto",
          fontSize: 15,
          lineHeight: 20,
          paddingTop: 10,
          paddingBottom: 10,
          paddingHorizontal: 16,
          textAlignVertical: "center",
          minHeight: 40,
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
