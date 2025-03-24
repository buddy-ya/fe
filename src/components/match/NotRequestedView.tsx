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
import { Lock, SendHorizonal, Check } from 'lucide-react-native';
import { CountryID, getCountryFlag, UNIVERSITY_ICONS, UniversityID } from '@/utils';
import { MyText } from '../common';
import { PlaneAnimation } from './PlaneAnimation';

interface Option {
  value: string;
  label: string;
  icon: any;
  locked?: boolean;
}

interface OptionButtonProps {
  option: Option;
  isSelected: boolean;
  onPress: () => void;
  iconSize: number;
  overlaySize: number;
}

const OptionButton = ({
  option,
  isSelected,
  onPress,
  iconSize,
  overlaySize,
}: OptionButtonProps) => {
  const IconComponent = option.icon;

  return (
    <TouchableOpacity onPress={onPress} disabled={option.locked} className="items-center">
      <View className="relative mb-2 overflow-hidden" pointerEvents="none">
        <IconComponent width={iconSize} height={iconSize} />
        {(isSelected || option.locked) && (
          <View className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-full bg-black/20">
            {option.locked ? (
              <Lock width={overlaySize} height={overlaySize} color="white" />
            ) : (
              <Check width={overlaySize} height={overlaySize} color="white" />
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
}

const OptionSection = ({
  title,
  options,
  selected,
  onSelect,
  iconSize = 60,
  overlaySize = 24,
}: OptionSectionProps) => {
  return (
    <View className="mb-6">
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
          />
        ))}
      </View>
    </View>
  );
};

interface NotRequestedViewProps {
  handleMatchRequest: (options: {
    universityType: 'SAME' | 'DIFFERENT';
    genderType: 'SAME' | 'ALL';
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
    },
    {
      value: 'DIFFERENT',
      label: t('match.not_requested.university.different'),
      icon: DiffUniIcon,
    },
  ];

  const countryOption: Option[] = [
    { value: 'GLOBAL', label: t('match.not_requested.country.global'), icon: GlobalIcon },
    { value: 'KOREA', label: t('match.not_requested.country.korea'), icon: KoreaIcon },
  ];

  let genderOptions: Option[] = [];
  if (userGender === 'male') {
    genderOptions = [
      { value: 'ALL', label: t('match.not_requested.gender.all'), icon: AllGenderIcon },
      { value: 'MALE', label: t('match.not_requested.gender.male'), icon: MaleGenderIcon },
      {
        value: 'FEMALE',
        label: t('match.not_requested.gender.female'),
        icon: FemaleGenderIcon,
        locked: true,
      },
    ];
  } else if (userGender === 'female') {
    genderOptions = [
      { value: 'ALL', label: t('match.not_requested.gender.all'), icon: AllGenderIcon },
      { value: 'FEMALE', label: t('match.not_requested.gender.female'), icon: FemaleGenderIcon },
      {
        value: 'MALE',
        label: t('match.not_requested.gender.male'),
        icon: MaleGenderIcon,
        locked: true,
      },
    ];
  }

  const handlePressMatch = () => {
    let mappedGender: 'SAME' | 'ALL' = 'ALL';
    if (
      (userGender === 'male' && genderType === 'MALE') ||
      (userGender === 'female' && genderType === 'FEMALE')
    ) {
      mappedGender = 'SAME';
    } else {
      mappedGender = 'ALL';
    }
    handleModalOpen('matchRequest', {
      onConfirm: () =>
        handleMatchRequest({
          universityType: universityType || 'SAME',
          genderType: mappedGender,
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
        <View className="mt-6 rounded-xl bg-white p-5">
          <MyText size="text-xl" className="mb-4 font-semibold">
            {t('match.not_requested.choose_conditions')}
          </MyText>
          <OptionSection
            title={t('match.not_requested.country.title')}
            options={countryOption}
            selected={countryType}
            onSelect={(value) => setCountryType(value as 'GLOBAL' | 'KOREA')}
            iconSize={50}
            overlaySize={20}
          />
          <OptionSection
            title={t('match.not_requested.university.title')}
            options={universityOptions}
            selected={universityType}
            onSelect={(value) => setUniversityType(value as 'SAME' | 'DIFFERENT')}
            iconSize={50}
            overlaySize={20}
          />
          <OptionSection
            title={t('match.not_requested.gender.title')}
            options={genderOptions}
            selected={genderType}
            onSelect={(value) => setGenderType(value as 'MALE' | 'FEMALE' | 'ALL')}
            iconSize={60}
            overlaySize={24}
          />
        </View>
        <TouchableOpacity
          onPress={handlePressMatch}
          disabled={!universityType || !genderType}
          className={`bottom-4 mt-10 h-12 w-full items-center justify-center rounded-xl ${
            !universityType || !genderType ? 'bg-[#CBCBCB]' : 'bg-primary'
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
