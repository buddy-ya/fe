import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView } from 'react-native';
import { UserRepository } from '@/api';
import {
  Heading,
  HeadingDescription,
  InnerLayout,
  KeyboardLayout,
  Layout,
  MyText,
} from '@/components';
import { ChatStackParamList, MyPageStackParamList } from '@/navigation/navigationRef';
import { useModalStore, useUserStore } from '@/store';
import { Gender, User } from '@/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { ImageFile, logError, processImageForUpload, removeNullValues } from '@/utils';
import { MyProfileImageOptionModal } from '@/components/modal/BottomOption/MyProfileImageOptionModal';
import ProfileView from '@/components/my/ProfileView';

type MyProfileScreenProps =
  | NativeStackScreenProps<MyPageStackParamList, 'MyProfile'>
  | NativeStackScreenProps<ChatStackParamList, 'Profile'>;

export default function MyProfileScreen({ navigation, route }: any) {
  const { t } = useTranslation(['mypage', 'interests', 'countries', 'languages', 'majors']);
  const [selectedAsset, setSelectedAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const modalVisible = useModalStore((state) => state.visible);
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const handleModalClose = useModalStore((state) => state.handleClose);
  const name = useUserStore((state) => state.name);
  const id = useUserStore((state) => state.id);
  const languages = useUserStore((state) => state.languages);
  const interests = useUserStore((state) => state.interests);
  const majors = useUserStore((state) => state.majors);
  const profileImageUrl = useUserStore((state) => state.profileImageUrl);
  const university = useUserStore((state) => state.university);
  const country = useUserStore((state) => state.country);
  const gender = useUserStore((state) => state.gender);
  const isDefaultProfileImage = useUserStore((state) => state.isDefaultProfileImage);
  const introductionFromStore = useUserStore((state) => state.introduction);
  const buddyActivityFromStore = useUserStore((state) => state.buddyActivity);
  const isMyProfile = route.params?.id == null || route.params.id === id;
  const update = useUserStore((state) => state.update);

  const userId = !isMyProfile ? route.params?.id : id;
  const incompleteProfile = isMyProfile ? (route.params?.incompleteProfile ?? false) : false;

  const { data } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => UserRepository.get({ id: userId }),
    enabled: !isMyProfile,
  });
  const user: User = {
    name: data?.name ?? name,
    id: data?.id ?? id,
    languages: data?.languages ?? languages,
    interests: data?.interests ?? interests,
    majors: data?.majors ?? majors,
    profileImageUrl: data?.profileImageUrl ?? profileImageUrl,
    university: data?.university ?? university,
    country: data?.country ?? country,
    gender: (data?.gender ?? gender) as Gender,
    introduction: data?.introduction ?? introductionFromStore,
    buddyActivity: data?.buddyActivity ?? buddyActivityFromStore,
  };
  const handleProfileImageDefault = async () => {
    try {
      const data = await UserRepository.updateProfileImage({
        isDefault: true,
        profileImage: null,
      });
      update(removeNullValues(data));
    } catch (error) {
      logError(error);
    }
  };
  const handleProfileImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.5,
        allowsEditing: true,
      });
      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        const formData = new FormData();
        formData.append('profileImage', processImageForUpload(selectedAsset as ImageFile));
        const data = await UserRepository.updateProfileImage({
          isDefault: false,
          profileImage: formData,
        });
        setSelectedAsset(selectedAsset);
        update(removeNullValues(data));
      }
    } catch (error) {
      logError(error);
    }
  };
  const handleModal = () => {
    handleModalOpen('myProfile');
  };
  const handleMatchingProfileSave = async (key: string, values: string[]) => {
    const data = await UserRepository.update({ key, values });
    update(removeNullValues(data));
  };

  const editHandlers = isMyProfile
    ? {
        handleEditName: () => {
          navigation.navigate('EditName', { isEditMode: true, initialName: name });
        },
        handleEditLanguages: () => {
          navigation.navigate('EditLanguage', { isEditMode: true, initialLanguages: languages });
        },
        handleEditInterests: () => {
          navigation.navigate('EditInterest', { isEditMode: true, initialInterests: interests });
        },
        handleProfileImageUpload,
        handleModalOpen: handleModal,
      }
    : {};
  const showMatchingProfile =
    isMyProfile ||
    (route.params?.showMatchingProfile !== undefined ? route.params.showMatchingProfile : false);

  return (
    <>
      <Layout showHeader onBack={() => navigation.goBack()} className="bg-gray-600">
        <KeyboardLayout>
          <InnerLayout>
            {incompleteProfile && (
              <View className="mb-10 rounded-xl">
                <MyText
                  size="text-[20px]"
                  className="mt-4 font-semibold leading-[1.4] tracking-wide"
                >
                  {t('mypage:profile.incompleteProfileTitle')}
                </MyText>
                <HeadingDescription>
                  {t('mypage:profile.incompleteProfileDescription')}
                </HeadingDescription>
              </View>
            )}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 80 }}
            >
              <ProfileView
                user={user}
                isMyProfile={isMyProfile}
                isDefaultProfileImage={isDefaultProfileImage}
                showMatchingProfile={showMatchingProfile}
                incompleteProfile={incompleteProfile}
                handleMatchingProfileSave={handleMatchingProfileSave}
                {...editHandlers}
              />
            </ScrollView>
          </InnerLayout>
        </KeyboardLayout>
      </Layout>
      <MyProfileImageOptionModal
        visible={modalVisible.myProfile}
        onProfileImageUpload={handleProfileImageUpload}
        onProfileImageDefault={handleProfileImageDefault}
        onClose={() => handleModalClose('myProfile')}
      />
    </>
  );
}
