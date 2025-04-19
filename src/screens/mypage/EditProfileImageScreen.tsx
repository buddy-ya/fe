import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { UserRepository } from '@/api';
import { InnerLayout, Layout, MyText } from '@/components';
import { MyPageStackParamList } from '@/navigation/navigationRef';
import { useUserStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const PROFILE_IMAGES = [
  'https://buddyya.s3.ap-northeast-2.amazonaws.com/default-profile-image/image1.png',
  'https://buddyya.s3.ap-northeast-2.amazonaws.com/default-profile-image/image2.png',
  'https://buddyya.s3.ap-northeast-2.amazonaws.com/default-profile-image/image3.png',
  'https://buddyya.s3.ap-northeast-2.amazonaws.com/default-profile-image/image4.png',
  'https://buddyya.s3.ap-northeast-2.amazonaws.com/default-profile-image/image5.png',
  'https://buddyya.s3.ap-northeast-2.amazonaws.com/default-profile-image/image6.png',
];

type EditProfileImageScreenProps = NativeStackScreenProps<MyPageStackParamList, 'EditProfileImage'>;

export default function EditProfileImageScreen({ navigation, route }: EditProfileImageScreenProps) {
  const profileImageUrl = useUserStore((state) => state.profileImageUrl);
  const { t } = useTranslation('mypage');
  const [selectedImage, setSelectedImage] = useState(profileImageUrl);

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const isChanged = useMemo(() => {
    return selectedImage !== profileImageUrl;
  }, [selectedImage, profileImageUrl]);

  const handleComplete = async () => {
    const imageKey = selectedImage.split('/').pop()?.replace('.png', '');
    if (!imageKey) return;
    await UserRepository.updateProfileImage(imageKey);
    navigation.goBack();
  };

  return (
    <Layout
      showHeader
      onBack={() => navigation.goBack()}
      headerCenter={
        <MyText size="text-xl" className="font-semibold">
          {t('profile.photo.title')}
        </MyText>
      }
      headerRight={
        <TouchableOpacity onPress={handleComplete}>
          <MyText
            size="text-xl"
            color={isChanged ? '' : 'text-textLight'}
            className="font-semibold"
          >
            {t('common.complete')}
          </MyText>
        </TouchableOpacity>
      }
    >
      <InnerLayout>
        <View className="mt-20 items-center">
          <Image
            source={{ uri: selectedImage }}
            className="h-[240px] w-[240px] rounded-[70px]"
            resizeMode="cover"
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="mt-10 flex-row flex-wrap justify-between gap-y-4 rounded-[20px] bg-white p-6">
            {PROFILE_IMAGES.map((imageUrl, index) => (
              <TouchableOpacity
                key={imageUrl}
                onPress={() => handleSelectImage(imageUrl)}
                className={`h-[86px] w-[86px] overflow-hidden rounded-[27px] ${selectedImage === imageUrl ? 'border-[1.5px] border-[#004D39]' : ''}`}
              >
                <Image source={{ uri: imageUrl }} className="h-full w-full" resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </InnerLayout>
    </Layout>
  );
}
