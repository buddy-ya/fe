import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Image, TouchableOpacity } from 'react-native';
import { MyText, Chip } from '@/components';
import { User } from '@/types';
import { Camera, Pencil } from 'lucide-react-native';
import { CountryID, getCountryFlag } from '@/utils/constants/countries';
import { INTEREST_ICONS } from '@/utils/constants/interests';
import { MAJOR_ICONS } from '@/utils/constants/majors';

interface Section {
  title: string;
  data: string[];
  translationPrefix: string;
  getIcon?: (id: string) => string;
  onEdit?: () => void;
  editable: boolean;
}

export interface ProfileViewProps {
  user: User;
  isMyProfile: boolean;
  isDefaultProfileImage?: boolean;
  handleProfileImageUpload?: () => void;
  handleModalOpen?: () => void;
  handleEditName?: () => void;
  handleEditLanguages?: () => void;
  handleEditInterests?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  isMyProfile,
  isDefaultProfileImage,
  handleProfileImageUpload,
  handleModalOpen,
  handleEditName,
  handleEditLanguages,
  handleEditInterests,
}) => {
  const { t } = useTranslation(['mypage', 'countries', 'majors', 'languages', 'interests']);

  const renderSectionHeader = (title: string, onEdit?: () => void) => (
    <View className="mb-2 flex-row items-center justify-between">
      <MyText size="text-[12px]" color="text-textDescription">
        {title}
      </MyText>
      {isMyProfile && onEdit && (
        <TouchableOpacity onPress={onEdit}>
          <MyText size="text-[12px]" color="text-textLight">
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

  const sections: Section[] = [
    {
      title: t('mypage:profile.sections.majors'),
      data: user.majors || [],
      translationPrefix: 'majors:majors',
      getIcon: (id) => MAJOR_ICONS[id],
      editable: false,
    },
    {
      title: t('mypage:profile.sections.languages'),
      data: user.languages || [],
      translationPrefix: 'languages:languages',
      onEdit: handleEditLanguages,
      editable: true,
    },
    {
      title: t('mypage:profile.sections.interests'),
      data: user.interests || [],
      translationPrefix: 'interests:interests',
      getIcon: (id) => INTEREST_ICONS[id],
      onEdit: handleEditInterests,
      editable: true,
    },
  ];

  return (
    <>
      {/* 프로필 상단 영역 */}
      <View className="mt-3 rounded-[12px]">
        <View className="items-center">
          <View className="relative h-[110px] w-[110px] overflow-hidden rounded-[25px]">
            <Image source={{ uri: user.profileImageUrl }} className="mb-4 h-full w-full" />
            {isMyProfile && (
              <TouchableOpacity
                className={`absolute left-0 top-0 flex h-full w-full ${
                  isDefaultProfileImage ? 'items-center justify-center bg-text opacity-[0.5]' : ''
                }`}
                onPress={isDefaultProfileImage ? handleProfileImageUpload : handleModalOpen}
              >
                {isDefaultProfileImage && <Camera size={36} strokeWidth={1.5} stroke="#FCFCFC" />}
              </TouchableOpacity>
            )}
          </View>

          <View className="mt-2 flex-row items-center">
            <MyText size="text-3xl" className="font-bold">
              {user.name}
            </MyText>
            {isMyProfile && handleEditName && (
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

      {/* 국가/성별 및 기타 섹션 */}
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
    </>
  );
};

export default ProfileView;
