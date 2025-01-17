import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Home, User, Users, MessageCircle } from 'lucide-react-native';
import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { isAndroid } from '@/utils';

const TAB_CONFIG = {
  Home: {
    Icon: Home,
    translationKey: 'tab.home',
  },
  Matching: {
    Icon: Users,
    translationKey: 'tab.matching',
  },
  Chat: {
    Icon: MessageCircle,
    translationKey: 'tab.chat',
  },
  MyPage: {
    Icon: User,
    translationKey: 'tab.my',
  },
};

export const tabBarStyle = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 10,
    height: isAndroid ? 65 : 80,
    backgroundColor: 'white',
    borderTopColor: '#E8E9EB',
    zIndex: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    marginTop: -5,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: {
    display: 'none',
  },
});

export const tabScreenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarStyle: tabBarStyle.tabBar,
  tabBarActiveTintColor: '#282828',
  tabBarInactiveTintColor: '#797977',
  tabBarLabelStyle: tabBarStyle.label,
  tabBarIconStyle: tabBarStyle.iconContainer,
};

export const getTabScreenOptions = (routeName: keyof typeof TAB_CONFIG) => {
  const { Icon, translationKey } = TAB_CONFIG[routeName];
  return {
    tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
      <Icon strokeWidth={1} size={24} color={color} fill={focused ? '#282828' : 'transparent'} />
    ),
    tabBarLabel: translationKey,
  };
};

export const useTabBarAnimation = () => {
  const translateY = React.useRef(new Animated.Value(0)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;

  const animateTabBar = (visible: boolean) => {
    if (visible) {
      translateY.setValue(100);
      opacity.setValue(0);
    }

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: visible ? 0 : 100,
        useNativeDriver: true,
        friction: 8,
        tension: 65,
        velocity: 0.5,
      }),

      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    if (!visible) {
      return tabBarStyle.hidden;
    }

    return {
      ...tabBarStyle.tabBar,
      transform: [{ translateY }],
      opacity,
    };
  };

  return { animateTabBar };
};
