import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Chip, InnerLayout, Layout, MyText } from '@/components';
import { MyPageStackParamList } from '@/navigation/navigationRef';
import { useUserStore } from '@/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pencil, RefreshCcw } from 'lucide-react-native';
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

type MyProfileScreenProps = NativeStackScreenProps<MyPageStackParamList, 'MyProfile'>;

export default function MyProfileScreen({ navigation, route }: MyProfileScreenProps) {
  const { t } = useTranslation(['mypage', 'interests', 'countries', 'languages', 'majors']);
  const name = useUserStore((state) => state.name);
  const languages = useUserStore((state) => state.languages);
  const interests = useUserStore((state) => state.interests);
  const majors = useUserStore((state) => state.majors);
  const profileImageUrl = useUserStore((state) => state.profileImageUrl);
  const university = useUserStore((state) => state.university);
  const country = useUserStore((state) => state.country);
  const gender = useUserStore((state) => state.gender);

  const handleEditPhoto = () => {
    navigation.navigate('EditProfileImage');
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
      data: majors,
      translationPrefix: 'majors:majors',
      getIcon: (id) => MAJOR_ICONS[id],
      editable: false,
    },
    {
      title: t('mypage:profile.sections.languages'),
      data: languages,
      translationPrefix: 'languages:languages',
      onEdit: handleEditLanguages,
      editable: true,
    },
    {
      title: t('mypage:profile.sections.interests'),
      data: interests,
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
      {onEdit && (
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
    <Layout showHeader onBack={() => navigation.goBack()} className="bg-gray-600">
      <InnerLayout>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mt-3 rounded-[20px]">
            <View className="items-center">
              <View className="relative">
                <Image
                  source={{ uri: profileImageUrl }}
                  className="mb-4 h-[110px] w-[110px] rounded-[25px]"
                />
                <TouchableOpacity
                  className="absolute -right-3 -top-1.5 rounded-full bg-white p-1.5"
                  onPress={handleEditPhoto}
                >
                  <RefreshCcw size={18} color={'#797979'} />
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center">
                <MyText size="text-3xl" className="font-bold">
                  {name}
                </MyText>
                <TouchableOpacity className="ml-2" onPress={handleEditName}>
                  <Pencil size={18} color="#797979" />
                </TouchableOpacity>
              </View>
              <MyText size="text-[13px]" color="text-textProfile" className="mt-2">
                {t(`profile.university.${university}`)}
              </MyText>
            </View>
          </View>

          <View className="mt-7 rounded-[20px] bg-white">
            <View className="flex-row items-start justify-between px-5 py-4">
              <View className="flex-1">
                {renderSectionHeader(t('mypage:profile.sections.country'))}
                <Chip
                  readOnly={true}
                  label={t(`countries:countries.${country}`)}
                  icon={getCountryFlag(country as CountryID)}
                  className="mr-0 border-[0px] pl-0"
                />
              </View>

              {gender !== 'unknown' && (
                <View className="w-[50%]">
                  {renderSectionHeader(t('mypage:profile.sections.gender'))}
                  <Chip
                    readOnly={true}
                    label={t(`mypage:profile.gender.${gender}`)}
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
  );
}
