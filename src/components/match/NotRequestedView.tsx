import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useModalStore, useUserStore } from '@/store';
import GlobalIcon from '@assets/icons/match/countryGlobal.svg';
import KoreaIcon from '@assets/icons/match/countryKorea.svg';
import DiffUniIcon from '@assets/icons/match/diffUniv.svg';
import AllGenderIcon from '@assets/icons/match/genderAll.svg';
import FemaleGenderIcon from '@assets/icons/match/genderFemale.svg';
import MaleGenderIcon from '@assets/icons/match/genderMale.svg';
import QuestionMarkIcon from '@assets/icons/match/question.svg';
import { Image as ExpoImage } from 'expo-image';
import { Lock, Check } from 'lucide-react-native';
import { CountryID, getCountryFlag, UNIVERSITY_ICONS, UniversityID } from '@/utils';
import { MyText } from '../common';
import { PlaneAnimation } from './PlaneAnimation';

interface Option {
  value: string;
  label: string;
  icon: any;
  locked?: boolean;
  category?: 'university' | 'country' | 'gender';
}

interface OptionButtonProps {
  option: Option;
  isSelected: boolean;
  onPress: () => void;
  iconSize?: number;
  overlaySize?: number;
  checkSize?: number;
}

const OptionButton = ({
  option,
  isSelected,
  onPress,
  iconSize,
  overlaySize,
  checkSize,
}: OptionButtonProps) => {
  const IconComponent = option.icon;

  return (
    <TouchableOpacity onPress={onPress} disabled={option.locked} className="items-center">
      <View className="relative mb-2 overflow-hidden" pointerEvents="none">
        <IconComponent width={iconSize} height={iconSize} />
        {(isSelected || option.locked) && (
          <View
            className={`absolute left-0 top-0 flex h-full w-full items-center justify-center ${option.category === 'gender' ? 'rounded-[17.5px]' : 'rounded-full'} bg-black/30`}
          >
            {option.locked ? (
              <Lock width={overlaySize} height={overlaySize} color="white" />
            ) : (
              <Check width={checkSize} height={checkSize} color="white" />
            )}
          </View>
        )}
      </View>
      <MyText color={`${option.locked && 'text-[#CBCBCB]'}`} className="font-medium">
        {option.label}
      </MyText>
    </TouchableOpacity>
  );
};

interface OptionSectionProps {
  title: string;
  options: Option[];
  selected: string | null;
  onSelect: (value: string) => void;
  iconSize?: number;
  overlaySize?: number;
  checkSize?: number;
  showBorder?: boolean;
}

const OptionSection = ({
  title,
  options,
  selected,
  onSelect,
  iconSize = 60,
  overlaySize = 24,
  checkSize,
  showBorder = false,
}: OptionSectionProps) => {
  return (
    <View className={`${showBorder && 'border-b'} border-[#F6F6F6] px-5 py-3`}>
      <MyText size="text-sm" color="text-textDescription" className="mb-4">
        {title}
      </MyText>
      <View className="flex-row items-center gap-10">
        {options.map((option) => (
          <OptionButton
            key={option.value}
            option={option}
            isSelected={selected === option.value}
            onPress={() => onSelect(option.value)}
            iconSize={iconSize}
            overlaySize={overlaySize}
            checkSize={checkSize}
          />
        ))}
      </View>
    </View>
  );
};

interface NotRequestedViewProps {
  handleMatchRequest: (options: {
    universityType: 'SAME' | 'DIFFERENT';
    genderType: 'MALE' | 'FEMALE' | 'ALL';
  }) => void;
  navigation: any;
}

export default function NotRequestedView({
  handleMatchRequest,
  navigation,
}: NotRequestedViewProps) {
  const { t } = useTranslation('match');
  const [countryType, setCountryType] = useState<'GLOBAL' | 'KOREA' | null>(null);
  const [universityType, setUniversityType] = useState<'SAME' | 'DIFFERENT' | null>(null);
  const [genderType, setGenderType] = useState<'MALE' | 'FEMALE' | 'ALL' | null>(null);

  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const userUniv = useUserStore((state) => state.university);
  const userGender = useUserStore((state) => state.gender);
  const userProfileImageUrl = useUserStore((state) => state.profileImageUrl);
  const userName = useUserStore((state) => state.name);
  const userCountry = useUserStore((state) => state.country);

  const universityOptions: Option[] = [
    {
      value: 'SAME',
      label: t('match.not_requested.university.same'),
      icon: UNIVERSITY_ICONS[userUniv as UniversityID],
      category: 'university',
    },
    {
      value: 'DIFFERENT',
      label: t('match.not_requested.university.different'),
      icon: DiffUniIcon,
      category: 'university',
    },
  ];

  const countryOption: Option[] = [
    {
      value: 'GLOBAL',
      label: t('match.not_requested.country.global'),
      icon: GlobalIcon,
      category: 'country',
      locked: userCountry !== 'ko',
    },
    {
      value: 'KOREA',
      label: t('match.not_requested.country.korea'),
      icon: KoreaIcon,
      category: 'country',
      locked: userCountry === 'ko',
    },
  ];

  const genderOptions: Option[] = [
    {
      value: 'ALL',
      label: t('match.not_requested.gender.all'),
      icon: AllGenderIcon,
      category: 'gender',
    },
    {
      value: 'FEMALE',
      label: t('match.not_requested.gender.female'),
      icon: FemaleGenderIcon,
      category: 'gender',
      locked: userGender === 'male',
    },
    {
      value: 'MALE',
      label: t('match.not_requested.gender.male'),
      icon: MaleGenderIcon,
      category: 'gender',
      locked: userGender === 'female',
    },
  ];

  const handlePressMatch = () => {
    handleModalOpen('matchRequest', {
      onConfirm: () =>
        handleMatchRequest({
          universityType: universityType || 'SAME',
          genderType: genderType || 'ALL',
        }),
    });
  };

  const handleProfilePress = () => {
    navigation.navigate('MyProfile');
  };

  return (
    <View className="flex-1">
      <View className="mt-4 w-full flex-row items-center justify-between gap-4 px-4">
        <TouchableOpacity onPress={handleProfilePress}>
          <View className="flex-row items-center gap-3">
            <ExpoImage
              style={{ height: 48, width: 48, borderRadius: 12 }}
              source={{ uri: userProfileImageUrl }}
              contentFit="contain"
            />
            <View>
              <MyText size="text-sm" color="text-black" className="font-semibold">
                {t(`universities:universities.${userUniv}`)}
              </MyText>
              <View className="flex-row items-center gap-1">
                <MyText size="text-sm" color="text-black">
                  {userName}
                </MyText>
                <MyText>{getCountryFlag(userCountry as CountryID)}</MyText>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <PlaneAnimation />
        <View className="h-[48px] w-[48px] flex-row items-center justify-center rounded-xl bg-white">
          <QuestionMarkIcon />
        </View>
      </View>
      <ScrollView className="pb-20">
        <View className="mt-6 rounded-xl bg-white pb-2">
          <MyText size="text-xl" className="px-5 pt-5 font-semibold">
            {t('match.not_requested.choose_conditions')}
          </MyText>
          <OptionSection
            title={t('match.not_requested.country.title')}
            options={countryOption}
            selected={countryType}
            onSelect={(value) => setCountryType(value as 'GLOBAL' | 'KOREA')}
            iconSize={50}
            overlaySize={12}
            checkSize={20}
            showBorder
          />
          <OptionSection
            title={t('match.not_requested.university.title')}
            options={universityOptions}
            selected={universityType}
            onSelect={(value) => setUniversityType(value as 'SAME' | 'DIFFERENT')}
            iconSize={50}
            overlaySize={12}
            checkSize={20}
            showBorder
          />
          <OptionSection
            title={t('match.not_requested.gender.title')}
            options={genderOptions}
            selected={genderType}
            onSelect={(value) => setGenderType(value as 'MALE' | 'FEMALE' | 'ALL')}
            iconSize={60}
            overlaySize={18}
            checkSize={30}
          />
        </View>
        <TouchableOpacity
          onPress={handlePressMatch}
          disabled={!countryType || !universityType || !genderType}
          className={`bottom-0 mt-10 h-12 w-full items-center justify-center rounded-xl ${
            !countryType || !universityType || !genderType ? 'bg-[#CBCBCB]' : 'bg-primary'
          }`}
        >
          <MyText size="text-lg" className="font-semibold text-white">
            {t('match.not_requested.button')}
          </MyText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
