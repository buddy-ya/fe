import React from "react";
import { Home, User, Users } from "lucide-react-native";

const TAB_CONFIG = {
  Home: {
    Icon: Home,
    translationKey: "tab.home",
  },
  Matching: {
    Icon: Users,
    translationKey: "tab.matching",
  },
  MyPage: {
    Icon: User,
    translationKey: "tab.my",
  },
};

export const tabScreenOptions = {
  headerShown: false,
  tabBarStyle: {
    paddingHorizontal: 10,
    height: 80,
    backgroundColor: "white",
    borderTopColor: "#E8E9EB",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tabBarActiveTintColor: "#282828",
  tabBarInactiveTintColor: "#797977",
  tabBarLabelStyle: {
    fontSize: 12,
    fontFamily: "Pretendard-Medium",
    marginTop: -5,
  },
};

export const getTabScreenOptions = (routeName: keyof typeof TAB_CONFIG) => {
  const { Icon, translationKey } = TAB_CONFIG[routeName];
  return {
    tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
      <Icon
        strokeWidth={1}
        size={24}
        color={color}
        fill={focused ? "#282828" : "transparent"}
      />
    ),
    tabBarLabel: translationKey,
  };
};
