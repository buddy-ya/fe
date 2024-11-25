import { TextInput, View } from "react-native";
import { Send } from "lucide-react-native";

interface CommentInputProps {
  value: string;
  onChange: (text: string) => void;
}

export const CommentInput = ({ value, onChange }: CommentInputProps) => (
  <View className="flex-row items-center justify-between px-4 py-3 border-t-[0.3px] border-borderBottom bg-white">
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="댓글을 입력하세요"
      className="bg-gray-100 rounded-full px-4 py-3 w-[88%]"
      multiline
      maxLength={1000}
    />
    <View className="">
      <Send strokeWidth={1.3} color="#CBCBCB" />
    </View>
  </View>
);
