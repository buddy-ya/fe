import { Image, View, TouchableOpacity } from 'react-native';

interface ImageViewProps {
  imageUrl?: string;
  onPress?: () => void;
}
export function ProfileImage({ imageUrl, onPress }: ImageViewProps) {
  const renderer = () => {
    return (
      <View>
        <Image className="h-[49px] w-[49px] rounded-[12px]" source={{ uri: imageUrl }} />
      </View>
    );
  };

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {renderer()}
      </TouchableOpacity>
    );
  }
  return (
    <View>
      <Image className="h-[49px] w-[49px] rounded-[12px]" source={{ uri: imageUrl }} />
    </View>
  );
}
