import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MyText, Chip } from '@/components';
import { useToastStore } from '@/store';
import { User } from '@/types';
import SchoolCheck from '@assets/icons/schoolCircleCheck.svg';
import * as Clipboard from 'expo-clipboard';
import { Camera, Pencil } from 'lucide-react-native';
import { UNIVERSITY_ICONS, UNIVERSITY_IDS, UniversityID } from '@/utils';
import { CountryID, getCountryFlag } from '@/utils/constants/countries';
import { INTEREST_ICONS } from '@/utils/constants/interests';
import { MAJOR_ICONS } from '@/utils/constants/majors';
import MatchProfile from './MatchProfile';

export interface ProfileViewProps {
  user: User;
  isMyProfile: boolean;
  isDefaultProfileImage?: boolean;
  handleProfileImageUpload?: () => void;
  handleModalOpen?: () => void;
  handleEditName?: () => void;
  handleEditLanguages?: () => void;
  handleEditInterests?: () => void;
  showMatchingProfile?: boolean;
  incompleteProfile?: boolean;
  characterImageUrl?: string;
  handleMatchingProfileSave?: (key: string, values: string[]) => void;
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
  showMatchingProfile,
  incompleteProfile,
  characterImageUrl,
  handleMatchingProfileSave,
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

  const sections = [
    {
      title: t('mypage:profile.sections.majors'),
      data: user.majors || [],
      translationPrefix: 'majors:majors',
      getIcon: (id: string) => MAJOR_ICONS[id],
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
      getIcon: (id: string) => INTEREST_ICONS[id],
      onEdit: handleEditInterests,
      editable: true,
    },
  ];

  const [localIntroduction, setLocalIntroduction] = useState<string>(user.introduction || '');
  const [localBuddyActivity, setLocalBuddyActivity] = useState<string>(user.buddyActivity || '');
  const [editingField, setEditingField] = useState<'introduction' | 'buddyActivity' | null>(null);
  const [errorIntroduction, setErrorIntroduction] = useState<string>('');
  const [errorBuddyActivity, setErrorBuddyActivity] = useState<string>('');

  useEffect(() => {
    setLocalIntroduction(user.introduction || '');
  }, [user.introduction]);

  useEffect(() => {
    setLocalBuddyActivity(user.buddyActivity || '');
  }, [user.buddyActivity]);

  const showToast = useToastStore((state) => state.showToast);

  const UniversityIcon = UNIVERSITY_ICONS[user.university as UniversityID];

  const handleCopy = async (text: string) => {
    showToast(<MyText>📋</MyText>, t('mypage:profile.toast.copySuccess'), 1200);
    await Clipboard.setStringAsync(text);
  };

  const handleSave = () => {
    if (editingField === 'introduction') {
      if (localIntroduction.trim().length < 10) {
        setErrorIntroduction(t('mypage:profile.error.minLength'));
        return;
      }
      setErrorIntroduction('');
      if (handleMatchingProfileSave) {
        handleMatchingProfileSave('introduction', [localIntroduction]);
      }
    } else if (editingField === 'buddyActivity') {
      if (localBuddyActivity.trim().length < 10) {
        setErrorBuddyActivity(t('mypage:profile.error.minLength'));
        return;
      }
      setErrorBuddyActivity('');
      if (handleMatchingProfileSave) {
        handleMatchingProfileSave('activity', [localBuddyActivity]);
      }
    }
    setEditingField(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={isMyProfile ? { paddingBottom: 70 } : { paddingBottom: 0 }}
      >
        <View className="mt-3 overflow-hidden rounded-[16px] bg-white p-5 py-9">
          <View className="flex-row items-center">
            <View className="relative h-[90px] w-[90px] overflow-hidden rounded-[25px]">
              <Image
                source={
                  characterImageUrl ? { uri: characterImageUrl } : { uri: user.profileImageUrl }
                }
                className="mb-4 h-full w-full"
              />
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
            <View className="ml-5">
              <View className="flex-row items-center">
                <MyText size="text-xl" className="font-semibold">
                  {user.name}
                </MyText>
                {isMyProfile && handleEditName && (
                  <TouchableOpacity
                    className="ml-2"
                    onPress={handleEditName}
                    style={{ zIndex: 10 }}
                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                  >
                    <Pencil size={15} color="#797979" strokeWidth={1.6} />
                  </TouchableOpacity>
                )}
              </View>
              <View className="flex-row items-center">
                <MyText className="mt-1 font-semibold">
                  {t(`universities:universities.${user.university}`)}
                </MyText>
              </View>

              {
                <View className="mt-[6px] flex-row items-center">
                  <MyText size="text-[14px]" className="font-semibold">
                    {user.isCertificated ? '학교 인증 완료' : '학교 미인증'}
                  </MyText>
                  {user.isCertificated && (
                    <View className="ml-1 items-center justify-center" pointerEvents="none">
                      <SchoolCheck />
                    </View>
                  )}
                </View>
              }
            </View>
            <View className="absolute -right-[5%] top-[52%] -translate-y-1/2 opacity-30">
              <UniversityIcon width={110} height={110} />
            </View>
          </View>
        </View>
        <View className="mt-7 rounded-[16px] bg-white">
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
          {showMatchingProfile && (
            <View className="border-t-[1px] border-borderBottom px-5 py-4">
              <MyText size="text-[12px]" color="text-textDescription">
                {t('mypage:profile.sections.matchingProfile')}
              </MyText>
              {incompleteProfile && (
                <MyText size="text-sm" className="mt-2 text-red-500">
                  {t('mypage:profile.error.incompleteProfile')}
                </MyText>
              )}
              <View className="mt-4">
                <MatchProfile
                  isEditing={editingField === 'introduction'}
                  isMyProfile={isMyProfile}
                  value={localIntroduction}
                  errorMessage={errorIntroduction}
                  onEdit={isMyProfile ? () => setEditingField('introduction') : undefined}
                  onChange={setLocalIntroduction}
                  onSave={handleSave}
                  onCopy={() => handleCopy(localIntroduction)}
                  questionText={t('mypage:profile.matchingProfile.questionIntroduction')}
                />
                <MatchProfile
                  isEditing={editingField === 'buddyActivity'}
                  isMyProfile={isMyProfile}
                  value={localBuddyActivity}
                  errorMessage={errorBuddyActivity}
                  onEdit={isMyProfile ? () => setEditingField('buddyActivity') : undefined}
                  onChange={setLocalBuddyActivity}
                  onSave={handleSave}
                  onCopy={() => handleCopy(localBuddyActivity)}
                  questionText={t('mypage:profile.matchingProfile.questionBuddyActivity')}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileView;
