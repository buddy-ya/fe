import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity } from 'react-native';
import { useModalStore, useUserStore } from '@/store';
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
          <View className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
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
  const [universityType, setUniversityType] = useState<'SAME' | 'DIFFERENT' | null>(null);
  const [genderType, setGenderType] = useState<'MALE' | 'FEMALE' | 'ALL' | null>(null);

  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const userUniv = useUserStore((state) => state.university);
  const userGender = useUserStore((state) => state.gender);

  const userProfileImageUrl = useUserStore((state) => state.profileImageUrl);
  const userName = useUserStore((state) => state.name);
  const userCountry = useUserStore((state) => state.country);

  const universityOptions: Option[] = [
    { value: 'SAME', label: '같은 학교', icon: UNIVERSITY_ICONS[userUniv as UniversityID] },
    { value: 'DIFFERENT', label: '다른 학교', icon: DiffUniIcon },
  ];

  let genderOptions: Option[] = [];
  if (userGender === 'male') {
    genderOptions = [
      { value: 'ALL', label: '모두', icon: AllGenderIcon },
      { value: 'MALE', label: '남성', icon: MaleGenderIcon },
      { value: 'FEMALE', label: '여성', icon: FemaleGenderIcon, locked: true },
    ];
  } else if (userGender === 'female') {
    genderOptions = [
      { value: 'ALL', label: '모두', icon: AllGenderIcon },
      { value: 'FEMALE', label: '여성', icon: FemaleGenderIcon },
      { value: 'MALE', label: '남성', icon: MaleGenderIcon, locked: true },
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
      <View className="mt-8 w-full flex-row items-center justify-between gap-4 px-4">
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
      <View className="mt-8 rounded-xl bg-white p-5">
        <MyText size="text-xl" className="mb-4 font-semibold">
          매칭 조건을 선택해주세요!
        </MyText>
        <OptionSection
          title="학교"
          options={universityOptions}
          selected={universityType}
          onSelect={(value) => setUniversityType(value as 'SAME' | 'DIFFERENT')}
          iconSize={50}
          overlaySize={20}
        />
        <OptionSection
          title="성별"
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
        className={`mt-8 h-12 items-center justify-center rounded-full ${
          !universityType || !genderType ? 'bg-[#CBCBCB]' : 'bg-primary'
        }`}
      >
        <MyText size="text-lg" className="font-semibold text-white">
          매칭하기
        </MyText>
      </TouchableOpacity>
    </View>
  );
}
