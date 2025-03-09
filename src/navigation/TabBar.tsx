import React from 'react';
import { View, Text } from 'react-native';
import { Animated, StyleSheet } from 'react-native';
import { useChatRoomStore } from '@/store';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Home, User, Users, Send } from 'lucide-react-native';
import { isAndroid } from '@/utils';

const TAB_CONFIG = {
  Home: {
    Icon: Home,
    translationKey: 'tab.home',
  },
  // Matching: {
  //   Icon: Users,
  //   translationKey: 'tab.matching',
  // },
  Chat: {
    Icon: Send,
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
    marginTop: 5,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
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
  lazy: true,
};

export const getTabScreenOptions = (routeName: keyof typeof TAB_CONFIG) => {
  const { Icon, translationKey } = TAB_CONFIG[routeName];
  return {
    tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => {
      if (routeName === 'Chat') {
        const totalUnreadCount = useChatRoomStore((state) => state.totalUnreadCount);
        return (
          <View className="relative">
            <Icon
              strokeWidth={1}
              size={24}
              color={color}
              fill={focused ? '#282828' : 'transparent'}
            />
            {totalUnreadCount > 0 && (
              <View className="absolute -right-2 -top-1 h-[16px] min-w-[16px] items-center justify-center rounded-full bg-primary px-1">
                <Text className="font-bold text-[10px] text-white">{totalUnreadCount}</Text>
              </View>
            )}
          </View>
        );
      }
      return (
        <Icon strokeWidth={1} size={24} color={color} fill={focused ? '#282828' : 'transparent'} />
      );
    },
    tabBarLabel: translationKey,
  };
};

export const useTabBarAnimation = () => {
  const translateY = React.useRef(new Animated.Value(0)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;

  const animateTabBar = (visible: boolean) => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: visible ? 0 : 100,
        useNativeDriver: true,
        duration: 100,
      }),
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        useNativeDriver: true,
        duration: 100,
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
