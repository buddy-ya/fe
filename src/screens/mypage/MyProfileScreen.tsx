import React, { useEffect } from "react";
import { View, ScrollView, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Pencil, RefreshCcw, RefreshCw } from "lucide-react-native";
import Layout from "@/components/common/Layout";
import InnerLayout from "@/components/common/InnerLayout";
import MyText from "@/components/common/MyText";
import { useProfileStore } from "@/store/profile";
import { getCountryFlag } from "@/utils/constants/countries";
import { Chip } from "@/components/common/Chip";
import { MAJOR_ICONS } from "@/utils/constants/majors";
import { INTEREST_ICONS } from "@/utils/constants/interests";
import { getProfile } from "@/api/mypage/mypage";

export default function MyProfileScreen({ navigation }) {
  const { t } = useTranslation([
    "mypage",
    "interests",
    "countries",
    "languages",
    "majors",
  ]);

  const { profile, setProfile } = useProfileStore();

  const fetchMyProfile = async () => {
    const profileData = await getProfile();
    setProfile(profileData);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchMyProfile();
    });

    return unsubscribe;
  }, [navigation]);

  const handleEditPhoto = () => {
    navigation.navigate("EditProfileImage");
  };

  const handleEditName = () => {
    navigation.navigate("EditName", {
      mode: "edit",
      initialName: profile.name,
    });
  };

  const handleEditLanguages = () => {
    navigation.navigate("EditLanguage", {
      mode: "edit",
      initialLanguages: profile.languages,
    });
  };

  const handleEditInterests = () => {
    navigation.navigate("EditInterest", {
      mode: "edit",
      initialInterests: profile.interests,
    });
  };

  const sections = [
    {
      title: t("mypage:profile.sections.majors"),
      data: profile?.majors,
      translationPrefix: "majors:majors",
      getIcon: (id: string) => MAJOR_ICONS[id],
      editable: false,
    },
    {
      title: t("mypage:profile.sections.languages"),
      data: profile.languages,
      translationPrefix: "languages:languages",
      onEdit: handleEditLanguages,
      editable: true,
    },
    {
      title: t("mypage:profile.sections.interests"),
      data: profile.interests,
      translationPrefix: "interests:interests",
      getIcon: (id: string) => INTEREST_ICONS[id],
      onEdit: handleEditInterests,
      editable: true,
    },
  ];

  const renderSectionHeader = (title: string, onEdit?: () => void) => (
    <View className="flex-row items-center justify-between mb-2">
      <MyText size="text-[12px]" color="text-textDescription" className="">
        {title}
      </MyText>
      {onEdit && (
        <TouchableOpacity className="px-3" onPress={onEdit}>
          <MyText size="text-[12px]" color="text-textLight" className="">
            {t("mypage:profile.edit")}
          </MyText>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSection = (
    title: string,
    children: React.ReactNode,
    onEdit?: () => void
  ) => (
    <View className="border-t-[1px] border-borderBottom px-5 py-4">
      {renderSectionHeader(title, onEdit)}
      {children}
    </View>
  );

  return (
    <Layout
      showHeader
      onBack={() => navigation.goBack()}
      className="bg-gray-600"
    >
      <InnerLayout>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="rounded-[20px] mt-3">
            <View className="items-center">
              <View className="relative">
                <Image
                  source={{ uri: profile.profileImageUrl }}
                  className="w-[110px] h-[110px] rounded-[25px] mb-4"
                />
                <TouchableOpacity
                  className="absolute -top-1.5 -right-3 bg-white p-1.5 rounded-full"
                  onPress={handleEditPhoto}
                >
                  <RefreshCcw size={18} color={"#797979"} />
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center">
                <MyText size="text-3xl" className="font-bold">
                  {profile.name}
                </MyText>
                <TouchableOpacity className="ml-2" onPress={handleEditName}>
                  <Pencil size={18} color="#797979" />
                </TouchableOpacity>
              </View>
              <MyText
                size="text-[13px]"
                color="text-textDescription"
                className=" mt-2"
              >
                {t(`profile.university.${profile.university}`)}
              </MyText>
            </View>
          </View>

          <View className="bg-white rounded-[20px] mt-7">
            <View className="py-4 px-5 flex-row justify-between items-start">
              <View className="flex-1">
                {renderSectionHeader(t("mypage:profile.sections.country"))}
                <Chip
                  readOnly={true}
                  label={t(`countries:countries.${profile.country}`)}
                  icon={getCountryFlag(profile.country)}
                  className="mr-0 pl-0 border-[0px]"
                />
              </View>

              {profile.gender !== "unknown" && (
                <View className="w-[50%]">
                  {renderSectionHeader(t("mypage:profile.sections.gender"))}
                  <Chip
                    readOnly={true}
                    label={t(`mypage:profile.gender.${profile.gender}`)}
                    className="ml-[0.8px] pl-0 border-[0px]"
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
                        className="pl-0 border-[0px]"
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
