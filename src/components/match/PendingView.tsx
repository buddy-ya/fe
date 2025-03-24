import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity } from 'react-native';
import { useUserStore } from '@/store';
import PendingIcon from '@assets/icons/match/pending.svg';
import QuestionMarkIcon from '@assets/icons/match/question.svg';
import { Image as ExpoImage } from 'expo-image';
import { useMatchStore } from '@/store/useMatchStore';
import MatchRepository from '@/api/MatchRepository';
import { CountryID, getCountryFlag } from '@/utils';
import { MyText } from '../common';
import { PlaneAnimation } from './PlaneAnimation';
import { ThreeDotLoader } from './ThreeDotLoader';

interface PendingViewProps {
  navigation: any;
}

export default function PendingView({ navigation }: PendingViewProps) {
  const { t } = useTranslation('match');
  const userUniv = useUserStore((state) => state.university);
  const userProfileImageUrl = useUserStore((state) => state.profileImageUrl);
  const userName = useUserStore((state) => state.name);
  const userCountry = useUserStore((state) => state.country);
  const updateMatchStatus = useMatchStore((state) => state.updateMatchStatus);

  const handlePressCancel = async () => {
    await MatchRepository.deleteMatchRequest();
    updateMatchStatus('not_requested');
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
      <View className="mt-8 items-center rounded-xl bg-white p-5">
        <MyText size="text-xl" className="mb-4 font-semibold">
          {t('match.pending.title')}
        </MyText>
        <MyText size="text-lg" color="text-textDescription" className="mb-4">
          {t('match.pending.description')}
        </MyText>
        <View className="mt-8 items-center justify-center">
          <PendingIcon />
        </View>
        <View className="mt-6 w-full pb-6">
          <ThreeDotLoader />
        </View>
      </View>
      <TouchableOpacity
        onPress={handlePressCancel}
        className="mt-10 h-12 w-full items-center justify-center rounded-full bg-white"
      >
        <MyText size="text-base" className="font-semibold text-black">
          {t('match.pending.button')}
        </MyText>
      </TouchableOpacity>
    </View>
  );
}
