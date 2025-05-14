import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, FlatList, ScrollView, Touchable } from 'react-native';
import { useModalStore, useUserStore } from '@/store';
import GlobalIcon from '@assets/icons/match/countryGlobal.svg';
import KoreaIcon from '@assets/icons/match/countryKorea.svg';
import AllGenderIcon from '@assets/icons/match/genderAll.svg';
import FemaleGenderIcon from '@assets/icons/match/genderFemale.svg';
import MaleGenderIcon from '@assets/icons/match/genderMale.svg';
import QuestionMarkIcon from '@assets/icons/match/question.svg';
import DiffUniIcon from '@assets/icons/seoul.svg';
import { Image as ExpoImage } from 'expo-image';
import { t } from 'i18next';
import { Lock, Check } from 'lucide-react-native';
import { CountryID, getCountryFlag, UNIVERSITY_ICONS, UniversityID } from '@/utils';
import { InnerLayout, MyText } from '../common';

interface Option {
  value: string;
  label: string;
  icon: any;
  locked?: boolean;
  invisible?: boolean;
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

  if (option.invisible) return;
  return (
    <TouchableOpacity onPress={onPress} disabled={option.locked} className="items-center">
      <View
        style={{ width: iconSize, height: iconSize }}
        className="relative mb-[10px] overflow-hidden"
        pointerEvents="none"
      >
        <IconComponent width={iconSize} height={iconSize} />
        {(isSelected || option.locked) && (
          <View
            className={`absolute left-0 top-0 h-full w-full items-center justify-center bg-black/30 ${option.category === 'gender' ? 'rounded-[17.5px]' : 'rounded-full'}`}
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
  iconSize = 50,
  overlaySize = 24,
  checkSize,
  showBorder = false,
}: OptionSectionProps) => {
  const visibleOptions = options.filter((opt) => !opt.invisible);
  return (
    <View className={`${showBorder && 'border-b'} border-[#F6F6F6] px-5 py-3`}>
      <MyText size="text-sm" color="text-textDescription" className="mb-4">
        {title}
      </MyText>
      <View className="flex-row gap-10">
        {visibleOptions.map((option) => (
          <View key={option.value} className="items-center">
            <OptionButton
              option={option}
              isSelected={selected === option.value}
              onPress={() => onSelect(option.value)}
              iconSize={iconSize}
              overlaySize={overlaySize}
              checkSize={checkSize}
            />
            {option.value === 'DIFFERENT' && (
              <MyText
                size="text-[10px]"
                className="mt-[2px] rounded-lg bg-[#E8F8F4] p-[1px] font-medium text-primary"
              >
                {t('match:match.not_requested.quick')}
              </MyText>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

interface NotRequestedViewProps {
  handleMatchRequest: (options: {
    nationalityType: 'KOREAN' | 'GLOBAL';
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
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const userUniv = useUserStore((state) => state.university);
  const userGender = useUserStore((state) => state.gender);
  const userCountry = useUserStore((state) => state.country);
  const userUnivMatchingActive = useUserStore((state) => state.isMatchingActive);

  const defaultCountry = userCountry === 'ko' ? 'GLOBAL' : 'KOREAN';
  const defaultUniversity = 'DIFFERENT';
  const defaultGender = 'ALL';

  const [countryType, setCountryType] = useState<'GLOBAL' | 'KOREAN' | null>(defaultCountry);
  const [universityType, setUniversityType] = useState<'SAME' | 'DIFFERENT' | null>(
    defaultUniversity
  );
  const [genderType, setGenderType] = useState<'MALE' | 'FEMALE' | 'ALL' | null>(null);

  const universityOptions: Option[] = [
    {
      value: 'DIFFERENT',
      label: t('match.not_requested.university.different'),
      icon: DiffUniIcon,
      category: 'university',
    },
    {
      value: 'SAME',
      label: t('match.not_requested.university.same'),
      icon: UNIVERSITY_ICONS[userUniv as UniversityID],
      category: 'university',
      locked: !userUnivMatchingActive,
    },
  ];

  const countryOption: Option[] = [
    {
      value: 'KOREAN',
      label: t('match.not_requested.country.korea'),
      icon: KoreaIcon,
      category: 'country',
      invisible: userCountry === 'ko',
    },
    {
      value: 'GLOBAL',
      label: t('match.not_requested.country.global'),
      icon: GlobalIcon,
      category: 'country',
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
      locked: userGender === 'male' || userGender == 'unknown',
    },
    {
      value: 'MALE',
      label: t('match.not_requested.gender.male'),
      icon: MaleGenderIcon,
      category: 'gender',
      locked: userGender === 'female' || userGender == 'unknown',
    },
  ];

  const handlePressMatch = () => {
    handleModalOpen('matchRequest', {
      onConfirm: () =>
        handleMatchRequest({
          nationalityType: countryType || 'GLOBAL',
          universityType: universityType || 'SAME',
          genderType: genderType || 'ALL',
        }),
    });
  };

  return (
    <InnerLayout>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-2 rounded-xl bg-white pb-2">
          <MyText size="text-xl" className="mb-2 px-5 pt-5 font-semibold">
            {t('match.not_requested.title')}
          </MyText>
          <OptionSection
            title={t('match.not_requested.country.title')}
            options={countryOption}
            selected={countryType}
            onSelect={(value) => setCountryType(value as 'GLOBAL' | 'KOREAN')}
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
            checkSize={28}
          />
        </View>
        <View className="mt-12 items-center">
          <TouchableOpacity
            onPress={handlePressMatch}
            disabled={!countryType || !universityType || !genderType}
            className={`w-[160px] flex-row items-center justify-center rounded-full py-3 ${
              !countryType || !universityType || !genderType ? 'bg-[#CBCBCB]' : 'bg-primary'
            }`}
          >
            <MyText size="text-lg" className="font-semibold text-white">
              {t('match.not_requested.button')}
            </MyText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </InnerLayout>
  );
}
