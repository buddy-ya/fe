import React from "react";
import { Home, User, Users } from "lucide-react-native";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { Platform, StyleSheet, Animated } from "react-native";

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

export const tabBarStyle = StyleSheet.create({
  tabBar: {
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    height: 80,
    backgroundColor: "white",
    borderTopColor: "#E8E9EB",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    zIndex: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: "Pretendard-Medium",
    marginTop: -5,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

export const tabScreenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarStyle: tabBarStyle.tabBar,
  tabBarActiveTintColor: "#282828",
  tabBarInactiveTintColor: "#797977",
  tabBarLabelStyle: tabBarStyle.label,
  tabBarIconStyle: tabBarStyle.iconContainer,
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

export const useTabBarAnimation = () => {
  const translateY = React.useRef(new Animated.Value(0)).current;

  const animateTabBar = (visible: boolean) => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 100,
      duration: 200,
      useNativeDriver: true,
    }).start();

    return {
      ...tabBarStyle.tabBar,
      transform: [
        {
          translateY: translateY,
        },
      ],
    };
  };

  return { animateTabBar };
};
