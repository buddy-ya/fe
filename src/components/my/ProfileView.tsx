import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MyText, Chip } from '@/components';
import { User } from '@/types';
import { Camera, Pencil } from 'lucide-react-native';
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
  introduction?: string;
  buddyActivity?: string;
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
  introduction,
  buddyActivity,
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

  const [localIntroduction, setLocalIntroduction] = useState<string>(introduction || '');
  const [localBuddyActivity, setLocalBuddyActivity] = useState<string>(buddyActivity || '');
  const [editingField, setEditingField] = useState<'introduction' | 'buddyActivity' | null>(null);
  const [errorIntroduction, setErrorIntroduction] = useState<string>('');
  const [errorBuddyActivity, setErrorBuddyActivity] = useState<string>('');

  useEffect(() => {
    setLocalIntroduction(introduction || '');
  }, [introduction]);

  useEffect(() => {
    setLocalBuddyActivity(buddyActivity || '');
  }, [buddyActivity]);

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
        contentContainerStyle={isMyProfile ? { paddingBottom: 70 } : { paddingBottom: 20 }}
      >
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
          {showMatchingProfile && (
            <View className="border-t-[1px] border-borderBottom px-5 py-4">
              <MyText size="text-[12px]" color="text-textDescription">
                {t('mypage:profile.sections.matchingProfile')}
              </MyText>
              {incompleteProfile && (
                <MyText className="mt-2 text-xs text-red-500">
                  {t('mypage:profile.error.incompleteProfile')}
                </MyText>
              )}
              <View className="mt-4">
                <MatchProfile
                  isEditing={editingField === 'introduction'}
                  value={localIntroduction}
                  errorMessage={errorIntroduction}
                  onEdit={isMyProfile ? () => setEditingField('introduction') : undefined}
                  onChange={setLocalIntroduction}
                  onSave={handleSave}
                  questionText={t('mypage:profile.matchingProfile.questionIntroduction')}
                />
                <MatchProfile
                  isEditing={editingField === 'buddyActivity'}
                  value={localBuddyActivity}
                  errorMessage={errorBuddyActivity}
                  onEdit={isMyProfile ? () => setEditingField('buddyActivity') : undefined}
                  onChange={setLocalBuddyActivity}
                  onSave={handleSave}
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
