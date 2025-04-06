import React from 'react';
import { View, Text } from 'react-native';
import { Animated, StyleSheet } from 'react-native';
import { useChatRoomStore } from '@/store';
import ChatIcon from '@assets/icons/tabs/chatIcon.svg';
import HomeIcon from '@assets/icons/tabs/home.svg';
import HomeActiveIcon from '@assets/icons/tabs/homeActive.svg';
import MatchingIcon from '@assets/icons/tabs/matching.svg';
import MatchingActiveIcon from '@assets/icons/tabs/matchingActive.svg';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Send, UserRound } from 'lucide-react-native';
import { isAndroid } from '@/utils';

const TAB_CONFIG = {
  Home: {
    Icon: HomeIcon,
    ActiveIcon: HomeActiveIcon,
    translationKey: 'tab.home',
  },
  Match: {
    Icon: MatchingIcon,
    ActiveIcon: MatchingActiveIcon,
    translationKey: 'tab.match',
  },
  Chat: {
    Icon: Send,
    ActiveIcon: null,
    translationKey: 'tab.chat',
  },
  MyPage: {
    Icon: UserRound,
    ActiveIcon: null,
    translationKey: 'tab.my',
  },
};

export const tabBarStyle = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 10,
    height: isAndroid ? 65 : 75,
    backgroundColor: 'white',
    borderTopColor: '#E8E9EB',
    zIndex: 1,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Pretendard-Bold',
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
  tabBarInactiveTintColor: '#CBCBCB',
  tabBarLabelStyle: tabBarStyle.label,
  tabBarIconStyle: tabBarStyle.iconContainer,
  lazy: true,
};

export const getTabScreenOptions = (routeName: keyof typeof TAB_CONFIG) => {
  const { Icon, ActiveIcon, translationKey } = TAB_CONFIG[routeName];
  return {
    tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => {
      // active 상태이고 ActiveIcon이 있을 경우 ActiveIcon 사용, 아니면 기본 Icon 사용
      const SelectedIcon = focused && ActiveIcon ? ActiveIcon : Icon;

      // Chat 탭은 unread count 배지가 있음
      if (routeName === 'Chat') {
        const totalUnreadCount = useChatRoomStore((state) => state.totalUnreadCount);
        return (
          <View className="relative">
            <SelectedIcon
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
        <SelectedIcon
          strokeWidth={1}
          size={24}
          color={color}
          fill={focused ? '#282828' : '#CBCBCB'}
        />
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
