import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { X } from 'lucide-react-native';
import MyText from './MyText';

interface FullScreenImageProps {
  visible: boolean;
  imageUrls: string[];
  initialIndex: number;
  onClose: () => void;
}

export const FullScreenImage: React.FC<FullScreenImageProps> = ({
  visible,
  imageUrls,
  initialIndex,
  onClose,
}) => {
  const { width, height } = Dimensions.get('window');
  const headerHeight = 80;
  const bottomPadding = 60;
  const viewerHeight = height - headerHeight - bottomPadding;

  const images = imageUrls.map((url) => ({ url }));
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black">
        <View className="mt-2 h-[80px] flex-row items-center justify-between px-4">
          <TouchableOpacity onPress={onClose} className="p-2">
            <MyText>
              <X color="white" size={24} hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }} />
            </MyText>
          </TouchableOpacity>
          {images.length >= 2 ? (
            <MyText color="text-white" size="text-lg" className="text-center font-semibold">
              {`${currentIndex + 1} / ${images.length}`}
            </MyText>
          ) : (
            <View className="w-8" />
          )}
          <View className="w-8" />
        </View>

        {/* 이미지 뷰어 영역 */}
        <View style={{ height: viewerHeight, width }} className="w-full">
          <ImageViewer
            imageUrls={images}
            index={initialIndex}
            enableSwipeDown
            swipeDownThreshold={100}
            onSwipeDown={onClose}
            onChange={(index) => setCurrentIndex(index)}
            renderIndicator={() => <></>}
            backgroundColor="transparent"
            loadingRender={() => (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};
