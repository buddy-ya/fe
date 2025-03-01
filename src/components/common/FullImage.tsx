import React from 'react';
import { Modal, View, TouchableOpacity, Text, Dimensions } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { X } from 'lucide-react-native';
import MyText from './MyText';

interface FullScreenImageProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
}

export const FullScreenImage: React.FC<FullScreenImageProps> = ({ visible, imageUri, onClose }) => {
  const { width, height } = Dimensions.get('window');
  const headerHeight = 80;
  const bottomPadding = 60;
  const viewerHeight = height - headerHeight - bottomPadding;
  const images = [{ url: imageUri }];

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View className="flex-1 bg-black">
        <View className="h-[80px] flex-row items-end justify-start">
          <TouchableOpacity onPress={onClose} className="p-3">
            <MyText>
              <X color={'white'} size={24} />
            </MyText>
          </TouchableOpacity>
        </View>
        <View style={{ height: viewerHeight, width }}>
          <ImageViewer
            imageUrls={images}
            enableSwipeDown={true}
            swipeDownThreshold={100}
            onSwipeDown={onClose}
            renderIndicator={() => <></>}
            backgroundColor="transparent"
          />
        </View>
      </View>
    </Modal>
  );
};
