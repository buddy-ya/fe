import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Layout from "@/components/common/Layout";
import MyText from "@/components/common/MyText";
import { useTranslation } from "react-i18next";
import {
  Bell,
  Bookmark,
  ChevronRight,
  NotebookPen,
  Settings,
  Settings2,
} from "lucide-react-native";
import LogoIcon from "@assets/icons/logo.svg";
import InnerLayout from "@/components/common/InnerLayout";
import { getProfile } from "@/api/mypage/mypage";
import { getCountryFlag } from "@/utils/constants/countries";

const SettingItem = ({ label, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between px-4 py-4 bg-white"
  >
    <MyText className="text-gray-900">{label}</MyText>
    <View className="w-2 h-2 border-t border-r border-gray-400 rotate-45" />
  </TouchableOpacity>
);

export default function MyPageScreen({ navigation }) {
  useEffect(() => {
    fetchMyProfile();
  }, []);
  const { t } = useTranslation("mypage");
  const [profile, setProfile] = useState({});

  const fetchMyProfile = async () => {
    const profile = await getProfile();
    setProfile(profile);
  };

  const quickMenuItems = [
    {
      key: "bookmark",
      label: t("bookmark"),
      icon: Bookmark,
      onPress: () => navigation.navigate("Bookmark"),
    },
    {
      key: "myPosts",
      label: t("myPosts"),
      icon: NotebookPen,
      onPress: () => navigation.navigate("MyPosts"),
    },
    {
      key: "settings",
      label: t("settings"),
      icon: Settings,
      onPress: () => navigation.navigate("Settings"),
    },
  ];

  const settingsItems = [
    { key: "bookmark", label: t("bookmark") },
    { key: "myPosts", label: t("myPosts") },
    { key: "notifications", label: t("notifications") },
    { key: "language", label: t("language") },
    { key: "privacy", label: t("privacy") },
    { key: "terms", label: t("terms") },
    { key: "version", label: t("version") },
  ];

  const handleNotification = () => {};

  return (
    <Layout
      showHeader
      className="bg-gray-500"
      headerLeft={<LogoIcon width={27} height={30} />}
      headerRight={
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleNotification}>
            <Bell strokeWidth={2} size={24} color="#797977" />
          </TouchableOpacity>
        </View>
      }
    >
      <InnerLayout>
        <TouchableOpacity
          className="flex-row items-center mt-3 p-5 bg-white rounded-[20px]"
          onPress={() => navigation.navigate("MyProfile", profile)}
        >
          <View className="flex-row items-center bg-white">
            <View className="w-[54] h-[54] bg-gray-200 rounded-[12px] mr-3" />
            <View className="flex-1">
              <MyText
                size="text-[16px]"
                className="text-textDescription font-semibold"
              >
                {t(`profile.university.${profile?.university}`)}
              </MyText>
              <View className="flex-row items-center">
                <MyText size="text-lg" className="text-textDescription">
                  {profile.name}
                </MyText>
                <MyText size="text-lg" className="ml-2">
                  {getCountryFlag(profile.country)}
                </MyText>
              </View>
            </View>
            <ChevronRight size={24} color="#CBCBCB" />
          </View>
        </TouchableOpacity>

        <View className="mt-3 flex-row justify-around py-5 bg-white rounded-[20px]">
          {quickMenuItems.map(({ key, label, icon: Icon, onPress }) => (
            <TouchableOpacity
              key={key}
              className="items-center"
              onPress={onPress}
            >
              <View className="mb-1">
                <Icon size={24} color="#282828" />
              </View>
              <MyText>{label}</MyText>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-4 bg-white">
          {settingsItems.map((item, index) => (
            <React.Fragment key={item.key}>
              <SettingItem
                label={item.label}
                onPress={() => navigation.navigate(item.key)}
              />
              {index < settingsItems.length - 1 && (
                <View className="h-[1px] bg-gray-100 mx-4" />
              )}
            </React.Fragment>
          ))}
        </View>
      </InnerLayout>
    </Layout>
  );
}
