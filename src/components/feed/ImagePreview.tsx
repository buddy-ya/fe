import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';

interface ImagePreviewProps {
  images: Array<{ uri: string }>;
  onRemove: (index: number) => void;
}

export function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  if (images.length === 0) return null;

  return (
    <View style={{ overflow: 'visible' }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
      >
        {images.map((image, index) => (
          <View key={index} className="mr-2" style={{ overflow: 'visible' }}>
            <View className="relative">
              <Image source={{ uri: image.uri }} className="h-16 w-16 rounded-[12px]" />
              <TouchableOpacity
                onPress={() => onRemove(index)}
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: 999,
                  padding: 4,
                  zIndex: 1,
                }}
              >
                <X size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
