import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SplashScreen from '@/screens/SplashScreen';
import { SuspendedRequestsScreen } from '@/screens/chat/ChatRequestsScreen';
import { SuspendedRoomListScreen } from '@/screens/chat/ChatRoomListScreen';
import { SuspendedChatRoomScreen } from '@/screens/chat/ChatRoomScreen';
import CommentEditScreen from '@/screens/home/CommentEditScreen';
import { SuspendedFeedDetailScreen } from '@/screens/home/FeedDetailScreen';
import FeedSearchScreen from '@/screens/home/FeedSearchScreen';
import FeedWriteScreen from '@/screens/home/FeedWriteScreen';
import { HomeScreen } from '@/screens/home/HomeScreen';
import BookmarkScreen from '@/screens/mypage/BookmarkScreen';
import EditProfileImageScreen from '@/screens/mypage/EditProfileImageScreen';
import MyPostsScreen from '@/screens/mypage/MyPostsScreen';
import MyProfileScreen from '@/screens/mypage/MyProfileScreen';
import SettingScreen from '@/screens/mypage/SettingScreen';
import VerificationScreen from '@/screens/mypage/VerificationScreen';
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
import { useModalStore, useUserStore, useToastStore } from '@/store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNavigationContainerRef,
  useNavigation,
  getFocusedRouteNameFromRoute,
  useRoute,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchingScreen from '@screens/matching/MatchingScreen';
import MyPageScreen from '@screens/mypage/MyPageScreen';
import { useNotification } from '@/hooks/useNotification';
import { GlobalModalContainer } from '@/components/common/GlobalModalContainer';
import { StudentCertificationModal } from '@/components/modal/Common';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import { getTabScreenOptions, tabScreenOptions, useTabBarAnimation } from './TabBar';
import {
  ChatStackParamList,
  FeedStackParamList,
  MyPageStackParamList,
  OnboardingStackParamList,
  RootStackParamList,
  VerificationStackParamList,
} from './navigationRef';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const FeedStack = createNativeStackNavigator<FeedStackParamList>();
const VerificationStack = createNativeStackNavigator<VerificationStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();
const MyPageStack = createNativeStackNavigator<MyPageStackParamList>();

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

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
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [{ name: 'FeedTab', params: { screen: 'FeedHome' } }],
            });
          },
        })}
      />
      {/* <Tab.Screen
        name="Matching"
        component={MatchingScreen}
        options={() => ({
          ...getTabScreenOptions('Matching'),
          tabBarLabel: t('tab.matching'),
        })}
      /> */}
      <Tab.Screen
        name="Chat"
        component={ChatNavigator}
        options={() => ({
          ...getTabScreenOptions('Chat'),
          tabBarLabel: t('tab.chat'),
        })}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Chat', params: { screen: 'RoomList' } }],
            });
          },
        })}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageNavigator}
        options={() => ({
          ...getTabScreenOptions('MyPage'),
          tabBarLabel: t('tab.my'),
        })}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [{ name: 'MyPage', params: { screen: 'MyPageHome' } }],
            });
          },
        })}
      />
    </Tab.Navigator>
  );
}

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen
        name="OnboardingWelcome"
        component={WelcomeScreen}
        options={{ gestureEnabled: false }}
      />
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
      />
      <OnboardingStack.Screen
        name="OnboardingStudentTypeSelect"
        component={StudentTypeSelectScreen}
      />
      <OnboardingStack.Screen name="OnboardingGenderSelect" component={GenderSelectScreen} />

      <OnboardingStack.Screen
        name="OnboardingName"
        component={NameScreen}
        options={{ gestureEnabled: false }}
      />
      <OnboardingStack.Screen name="OnboardingCountrySelect" component={CountrySelectScreen} />
      <OnboardingStack.Screen name="OnboardingLanguageSelect" component={LanguageSelectScreen} />
      <OnboardingStack.Screen name="OnboardingMajorSelect" component={MajorSelectScreen} />
      <OnboardingStack.Screen name="OnboardingInterestSelect" component={InterestSelectScreen} />
    </OnboardingStack.Navigator>
  );
}

function FeedNavigator() {
  const navigation = useNavigation();
  const { animateTabBar } = useTabBarAnimation();

  React.useEffect(() => {
    const onStateChange = () => {
      const state = navigation.getState();
      const activeTab = state?.routes[state.index];
      const activeScreen = activeTab?.state?.routes?.[activeTab.state.index as any]?.name;
      const visible = activeScreen === 'FeedHome' || activeScreen === undefined;
      navigation.setOptions({
        tabBarStyle: animateTabBar(!!visible),
      });
    };

    const unsubscribe = navigation.addListener('state', onStateChange);
    return unsubscribe;
  }, []);

  return (
    <FeedStack.Navigator initialRouteName="FeedHome" screenOptions={{ headerShown: false }}>
      <FeedStack.Screen
        name="FeedHome"
        component={HomeScreen}
        options={{ gestureEnabled: false }}
      />
      <FeedStack.Screen name="FeedSearch" component={FeedSearchScreen} />
      <FeedStack.Screen name="FeedWrite" component={FeedWriteScreen} />
      <FeedStack.Screen name="FeedDetail" component={SuspendedFeedDetailScreen} />
      <FeedStack.Screen name="CommentEdit" component={CommentEditScreen} />
    </FeedStack.Navigator>
  );
}

function VerificationNavigator() {
  return (
    <VerificationStack.Navigator
      initialRouteName="VerificationSelect"
      screenOptions={{ headerShown: false }}
    >
      <VerificationStack.Screen name="VerificationSelect" component={VerificationScreen} />
      <VerificationStack.Screen name="EmailVerification" component={EmailScreen} />
      <VerificationStack.Screen
        name="EmailVerificationCode"
        component={EmailVerificationScreen}
        options={{ gestureEnabled: false }}
      />
      <VerificationStack.Screen
        name="EmailComplete"
        component={EmailCompleteScreen}
        options={{ gestureEnabled: false }}
      />
      <VerificationStack.Screen
        name="StudentIdVerification"
        component={StudentIdCardUploadScreen}
      />
      <VerificationStack.Screen
        name="StudentIdComplete"
        component={StudentIdCardCompleteScreen}
        options={{ gestureEnabled: false }}
      />
    </VerificationStack.Navigator>
  );
}

function ChatNavigator() {
  const navigation = useNavigation();
  const { animateTabBar } = useTabBarAnimation();
  const route = useRoute();

  React.useEffect(() => {
    const onStateChange = () => {
      const state = navigation.getState();
      const activeTab = state?.routes[state.index];
      let activeScreen = activeTab?.state?.routes?.[activeTab.state.index as any]?.name;
      if (!activeScreen) {
        if (!activeScreen) {
          activeScreen = (route.params as { screen?: string })?.screen;
        }
      }
      const visible = activeScreen !== 'ChatRoom' && activeScreen !== 'Profile';
      navigation.setOptions({
        tabBarStyle: animateTabBar(visible),
      });
    };

    const unsubscribe = navigation.addListener('state', onStateChange);
    return unsubscribe;
  }, []);

  return (
    <ChatStack.Navigator initialRouteName="RoomList" screenOptions={{ headerShown: false }}>
      <ChatStack.Screen
        name="RoomList"
        component={SuspendedRoomListScreen}
        options={{ gestureEnabled: false }}
      />
      <ChatStack.Screen name="ChatRoom" component={SuspendedChatRoomScreen} />
      <ChatStack.Screen name="ChatRequests" component={SuspendedRequestsScreen} />
      <ChatStack.Screen name="Profile" component={MyProfileScreen} />
    </ChatStack.Navigator>
  );
}

function MyPageNavigator() {
  const navigation = useNavigation();
  const { animateTabBar } = useTabBarAnimation();

  React.useEffect(() => {
    const onStateChange = () => {
      const state = navigation.getState();
      const activeTab = state?.routes[state.index];
      const activeScreen = activeTab?.state?.routes?.[activeTab.state.index as any]?.name;
      const visible = activeScreen === 'MyPageHome' || activeScreen === undefined;
      navigation.setOptions({
        tabBarStyle: animateTabBar(!!visible),
      });
    };

    const unsubscribe = navigation.addListener('state', onStateChange);
    return unsubscribe;
  }, []);

  return (
    <MyPageStack.Navigator initialRouteName="MyPageHome" screenOptions={{ headerShown: false }}>
      <MyPageStack.Screen
        name="MyPageHome"
        component={MyPageScreen}
        options={{ gestureEnabled: false }}
      />
      <MyPageStack.Screen name="MyProfile" component={MyProfileScreen} />
      <MyPageStack.Screen name="EditProfileImage" component={EditProfileImageScreen} />
      <MyPageStack.Screen name="EditName" component={NameScreen} />
      <MyPageStack.Screen name="EditLanguage" component={LanguageSelectScreen} />
      <MyPageStack.Screen name="EditInterest" component={InterestSelectScreen} />
      <MyPageStack.Screen name="Bookmark" component={BookmarkScreen} />
      <MyPageStack.Screen name="MyPosts" component={MyPostsScreen} />
      <MyPageStack.Screen name="Settings" component={SettingScreen} />
      <MyPageStack.Screen name="FeedDetail" component={SuspendedFeedDetailScreen} />
    </MyPageStack.Navigator>
  );
}

export default function Router() {
  const modalVisible = useModalStore((state) => state.visible.studentCertification);
  const handleModalClose = useModalStore((state) => state.handleClose);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const navigation = useNavigation<any>();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    }
  }, [isAuthenticated]);

  useNotification();

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        <Stack.Screen name="Verification" component={VerificationNavigator} />
        <Stack.Screen name="Tab" component={TabNavigator} />
      </Stack.Navigator>
      <GlobalModalContainer />
    </>
  );
}
