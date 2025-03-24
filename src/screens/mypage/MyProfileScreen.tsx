import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { UserRepository } from '@/api';
import { Chip, FeedOptionModal, InnerLayout, Layout, MyText } from '@/components';
import { ChatStackParamList, MyPageStackParamList } from '@/navigation/navigationRef';
import { useModalStore, useUserStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Pencil, RefreshCcw } from 'lucide-react-native';
import { ImageFile, logError, processImageForUpload, removeNullValues } from '@/utils';
import { CountryID, getCountryFlag } from '@/utils/constants/countries';
import { INTEREST_ICONS } from '@/utils/constants/interests';
import { MAJOR_ICONS } from '@/utils/constants/majors';
import { MyProfileImageOptionModal } from '@/components/modal/BottomOption/MyProfileImageOptionModal';

interface Section {
  title: string;
  data: string[];
  translationPrefix: string;
  getIcon?: (id: string) => string;
  onEdit?: () => void;
  editable: boolean;
}

type MyProfileScreenProps =
  | NativeStackScreenProps<MyPageStackParamList, 'MyProfile'>
  | NativeStackScreenProps<ChatStackParamList, 'Profile'>;

// TODO: 다른 탭에서 사용하는 Screen 타입 정의내리기
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
  const isMyProfile = route.params?.id == null || route.params.id === id;

  const update = useUserStore((state) => state.update);

  const { data } = useQuery({
    queryKey: ['users', route.params?.id],
    queryFn: () => UserRepository.get({ id: route.params.id }),
    enabled: !isMyProfile,
  });

  const user = {
    name: data?.name ?? name,
    id: data?.id ?? id,
    languages: data?.languages ?? languages,
    interests: data?.interests ?? interests,
    majors: data?.majors ?? majors,
    profileImageUrl: data?.profileImageUrl ?? profileImageUrl,
    university: data?.university ?? university,
    country: data?.country ?? country,
    gender: data?.gender ?? gender,
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
      if (status !== 'granted') {
        return;
      }
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

  const handleEditName = () => {
    navigation.navigate('EditName', {
      isEditMode: true,
      initialName: name,
    });
  };

  const handleEditLanguages = () => {
    navigation.navigate('EditLanguage', {
      isEditMode: true,
      initialLanguages: languages,
    });
  };

  const handleEditInterests = () => {
    navigation.navigate('EditInterest', {
      isEditMode: true,
      initialInterests: interests,
    });
  };

  const sections: Section[] = [
    {
      title: t('mypage:profile.sections.majors'),
      data: user.majors,
      translationPrefix: 'majors:majors',
      getIcon: (id) => MAJOR_ICONS[id],
      editable: false,
    },
    {
      title: t('mypage:profile.sections.languages'),
      data: user.languages,
      translationPrefix: 'languages:languages',
      onEdit: handleEditLanguages,
      editable: true,
    },
    {
      title: t('mypage:profile.sections.interests'),
      data: user.interests,
      translationPrefix: 'interests:interests',
      getIcon: (id) => INTEREST_ICONS[id],
      onEdit: handleEditInterests,
      editable: true,
    },
  ];

  const renderSectionHeader = (title: string, onEdit?: () => void) => (
    <View className="mb-2 flex-row items-center justify-between">
      <MyText size="text-[12px]" color="text-textDescription" className="">
        {title}
      </MyText>
      {isMyProfile && onEdit && (
        <TouchableOpacity className="" onPress={onEdit}>
          <MyText size="text-[12px]" color="text-textLight" className="">
            {t('mypage:profile.edit')}
          </MyText>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSection = (title: string, children: React.ReactNode, onEdit?: () => void) => (
    <View className="border-t-[1px] border-borderBottom px-5 py-4">
      {renderSectionHeader(title, onEdit)}
      {children}
    </View>
  );

  return (
    <>
      <Layout showHeader onBack={() => navigation.goBack()} className="bg-gray-600">
        <InnerLayout>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mt-3 rounded-[12px]">
              <View className="items-center">
                <View className="relative h-[110px] w-[110px] overflow-hidden rounded-[25px]">
                  <Image source={{ uri: user.profileImageUrl }} className="mb-4 h-full w-full" />
                  {isMyProfile && (
                    <TouchableOpacity
                      className={`absolute left-0 top-0 flex h-full w-full ${
                        isDefaultProfileImage
                          ? 'items-center justify-center bg-text opacity-[0.5]'
                          : ''
                      }`}
                      onPress={
                        isDefaultProfileImage
                          ? handleProfileImageUpload
                          : () => handleModalOpen('myProfile')
                      }
                    >
                      {isDefaultProfileImage && (
                        <Camera size={36} strokeWidth={1.5} stroke="#FCFCFC" />
                      )}
                    </TouchableOpacity>
                  )}
                </View>

                <View className="mt-2 flex-row items-center">
                  <MyText size="text-3xl" className="font-bold">
                    {user.name}
                  </MyText>
                  {isMyProfile && (
                    <TouchableOpacity className="ml-2" onPress={handleEditName}>
                      <Pencil size={18} color="#797979" />
                    </TouchableOpacity>
                  )}
                </View>
                <MyText size="text-[13px]" color="text-textProfile" className="mt-2">
                  {t(`universities:universities.${user.university}`)}
                </MyText>
              </View>
            </View>

            <View className="mt-7 rounded-[20px] bg-white">
              <View className="flex-row items-start justify-between px-5 py-4">
                <View className="flex-1">
                  {renderSectionHeader(t('mypage:profile.sections.country'))}
                  <Chip
                    readOnly={true}
                    label={t(`countries:countries.${user.country}`)}
                    icon={getCountryFlag(user.country as CountryID)}
                    className="mr-0 border-[0px] pl-0"
                  />
                </View>

                {user.gender !== 'unknown' && (
                  <View className="w-[50%]">
                    {renderSectionHeader(t('mypage:profile.sections.gender'))}
                    <Chip
                      readOnly={true}
                      label={t(`mypage:profile.gender.${user.gender}`)}
                      className="ml-[0.8px] border-[0px] pl-0"
                    />
                  </View>
                )}
              </View>

              {sections.map((section) => (
                <React.Fragment key={section.translationPrefix}>
                  {renderSection(
                    section.title,
                    <View className="flex-row flex-wrap gap-2">
                      {section.data.map((item) => (
                        <Chip
                          readOnly={true}
                          key={item}
                          label={t(`${section.translationPrefix}.${item}`)}
                          icon={section.getIcon?.(item)}
                          className="border-[0px] pl-0"
                        />
                      ))}
                    </View>,
                    section.onEdit
                  )}
                </React.Fragment>
              ))}
            </View>
          </ScrollView>
        </InnerLayout>
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
