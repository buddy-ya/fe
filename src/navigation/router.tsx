import SplashScreen from '@/screens/SplashScreen';
import CommentEditScreen from '@/screens/home/CommentEditScreen';
import FeedDetailScreen from '@/screens/home/FeedDetailScreen';
import FeedSearchScreen from '@/screens/home/FeedSearchScreen';
import FeedWriteScreen from '@/screens/home/FeedWriteScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import BookmarkScreen from '@/screens/mypage/BookmarkScreen';
import EditProfileImageScreen from '@/screens/mypage/EditProfileImageScreen';
import MyPostsScreen from '@/screens/mypage/MyPostsScreen';
import MyProfileScreen from '@/screens/mypage/MyProfileScreen';
import CountrySelectScreen from '@/screens/onboarding/CountrySelectScreen';
import GenderSelectScreen from '@/screens/onboarding/GenderSelectScreen';
import InterestSelectScreen from '@/screens/onboarding/InterestSelectScreen';
import LanguageSelectScreen from '@/screens/onboarding/LanguageSelectScreen';
import MajorSelectScreen from '@/screens/onboarding/MajorSelectScreen';
import NameScreen from '@/screens/onboarding/NameScreen';
import NotificationScreen from '@/screens/onboarding/NotificationScreen';
import PhoneScreen from '@/screens/onboarding/PhoneScreen';
import PhoneVerificationScreen from '@/screens/onboarding/PhoneVerificationScreen';
import UniversitySelectScreen from '@/screens/onboarding/UniversitySelectScreen';
import StudentInfo from '@/screens/onboarding/archived/StudentInfoScreen';
import StudentTypeSelectScreen from '@/screens/onboarding/archived/StudentTypeSelectScreen';
import EmailCompleteScreen from '@/screens/verification/EmailCompleteScreen';
import EmailScreen from '@/screens/verification/EmailScreen';
import EmailVerificationScreen from '@/screens/verification/EmailVerificationScreen';
import StudentIdCardCompleteScreen from '@/screens/verification/StudentIdCompleteScreen';
import StudentIdCardUploadScreen from '@/screens/verification/StudentIdUploadScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNavigationContainerRef,
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchingScreen from '@screens/matching/MatchingScreen';
import MyPageScreen from '@screens/mypage/MyPageScreen';
import React from 'react';
import { useTranslation } from 'react-i18next';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import { getTabScreenOptions, tabScreenOptions, useTabBarAnimation } from './TabBar';
import ChatScreen from '@/screens/chat/ChatScreen';
import RoomListScreen from '@/screens/chat/RoomListScreen';

export const navigationRef = createNavigationContainerRef();

export const resetToOnboarding = () => {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  }
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const OnboardingStack = createNativeStackNavigator();
const FeedStack = createNativeStackNavigator();
const MyPageStack = createNativeStackNavigator();

function TabNavigator() {
  const { t } = useTranslation('common');

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="FeedTab"
        component={FeedNavigator}
        options={() => ({
          ...getTabScreenOptions('Home'),
          tabBarLabel: t('tab.home'),
        })}
      />
      <Tab.Screen
        name="Matching"
        component={MatchingScreen}
        options={() => ({
          ...getTabScreenOptions('Matching'),
          tabBarLabel: t('tab.matching'),
        })}
      />
      <Tab.Screen
        name="Chat"
        component={ChatNavigator}
        options={() => ({
          ...getTabScreenOptions('Chat'),
          tabBarLabel: t('tab.chat'),
        })}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageNavigator}
        options={() => ({
          ...getTabScreenOptions('MyPage'),
          tabBarLabel: t('tab.my'),
        })}
      />
    </Tab.Navigator>
  );
}

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="OnboardingWelcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="OnboardingPhone" component={PhoneScreen} />
      <OnboardingStack.Screen
        name="OnboardingPhoneVerification"
        component={PhoneVerificationScreen}
      />
      <OnboardingStack.Screen
        name="OnboardingNotification"
        component={NotificationScreen}
        options={{ gestureEnabled: false }}
      />
      <OnboardingStack.Screen
        name="OnboardingStudentInfo"
        component={StudentInfo}
        options={{ gestureEnabled: false }}
      />
      <OnboardingStack.Screen
        name="OnboardingUniversitySelect"
        component={UniversitySelectScreen}
        options={{ gestureEnabled: false }}
      />
      <OnboardingStack.Screen
        name="OnboardingStudentTypeSelect"
        component={StudentTypeSelectScreen}
      />
      <OnboardingStack.Screen name="OnboardingGenderSelect" component={GenderSelectScreen} />
      <OnboardingStack.Screen name="OnboardingName" component={NameScreen} />
      <OnboardingStack.Screen name="OnboardingCountrySelect" component={CountrySelectScreen} />
      <OnboardingStack.Screen name="OnboardingLanguageSelect" component={LanguageSelectScreen} />
      <OnboardingStack.Screen name="OnboardingMajorSelect" component={MajorSelectScreen} />
      <OnboardingStack.Screen name="OnboardingInterestSelect" component={InterestSelectScreen} />
    </OnboardingStack.Navigator>
  );
}

function FeedNavigator({ navigation, route }) {
  const { animateTabBar } = useTabBarAnimation();

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const visible = routeName === 'FeedHome' || routeName === undefined;
    navigation.setOptions({
      tabBarStyle: animateTabBar(visible),
    });
  }, [route]);

  return (
    <FeedStack.Navigator screenOptions={{ headerShown: false }}>
      <FeedStack.Screen name="FeedHome" component={HomeScreen} />
      <FeedStack.Screen name="FeedSearch" component={FeedSearchScreen} />
      <FeedStack.Screen name="FeedWrite" component={FeedWriteScreen} />
      <FeedStack.Screen name="FeedDetail" component={FeedDetailScreen} />
      <FeedStack.Screen name="CommentEdit" component={CommentEditScreen} />
      <FeedStack.Screen name="EmailVerification" component={EmailScreen} />
      <FeedStack.Screen
        name="EmailVerificationCode"
        component={EmailVerificationScreen}
        options={{ gestureEnabled: false }}
      />
      <FeedStack.Screen
        name="EmailComplete"
        component={EmailCompleteScreen}
        options={{ gestureEnabled: false }}
      />
      <FeedStack.Screen name="StudentIdVerification" component={StudentIdCardUploadScreen} />
      <FeedStack.Screen
        name="StudentIdComplete"
        component={StudentIdCardCompleteScreen}
        options={{ gestureEnabled: false }}
      />
    </FeedStack.Navigator>
  );
}

function ChatNavigator({ navigation, route }) {
  const { animateTabBar } = useTabBarAnimation();

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    navigation.setOptions({
      tabBarStyle: animateTabBar(true),
    });
  }, [route]);

  return (
    <FeedStack.Navigator screenOptions={{ headerShown: false }}>
      <FeedStack.Screen name="RoomList" component={RoomListScreen} />
      <FeedStack.Screen name="Chat" component={ChatScreen} />
    </FeedStack.Navigator>
  );
}

function MyPageNavigator({ navigation, route }) {
  const { animateTabBar } = useTabBarAnimation();

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const visible = routeName === 'MyPageHome' || routeName === undefined;
    navigation.setOptions({
      tabBarStyle: animateTabBar(visible),
    });
  }, [route]);
  return (
    <MyPageStack.Navigator screenOptions={{ headerShown: false }}>
      <MyPageStack.Screen name="MyPageHome" component={MyPageScreen} />
      <MyPageStack.Screen name="MyProfile" component={MyProfileScreen} />
      <MyPageStack.Screen name="EditProfileImage" component={EditProfileImageScreen} />
      <MyPageStack.Screen name="EditName" component={NameScreen} />
      <MyPageStack.Screen name="EditLanguage" component={LanguageSelectScreen} />
      <MyPageStack.Screen name="EditInterest" component={InterestSelectScreen} />
      <MyPageStack.Screen name="Bookmark" component={BookmarkScreen} />
      <MyPageStack.Screen name="MyPosts" component={MyPostsScreen} />
      <MyPageStack.Screen name="FeedDetail" component={FeedDetailScreen} />
    </MyPageStack.Navigator>
  );
}

export default function Router() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        <Stack.Screen name="Tab" component={TabNavigator} />
        <Stack.Screen name="Chat" component={ChatNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
