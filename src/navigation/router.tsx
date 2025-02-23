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
import { SuspendedHomeScreen } from '@/screens/home/HomeScreen';
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
import { useModalStore, useUserStore } from '@/store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNavigationContainerRef, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchingScreen from '@screens/matching/MatchingScreen';
import MyPageScreen from '@screens/mypage/MyPageScreen';
import useNotification from '@/hooks/useNotification';
import { StudentCertificationModal } from '@/components/modal/Common';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import { getTabScreenOptions, tabScreenOptions, useTabBarAnimation } from './TabBar';
import {
  ChatStackParamList,
  FeedStackParamList,
  MyPageStackParamList,
  OnboardingStackParamList,
  VerificationStackParamList,
} from './navigationRef';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const FeedStack = createNativeStackNavigator<FeedStackParamList>();
const VerificationStack = createNativeStackNavigator<VerificationStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();
const MyPageStack = createNativeStackNavigator<MyPageStackParamList>();

export const navigationRef = createNavigationContainerRef();

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
            e.preventDefault(); // 기본 동작 막기
            navigation.reset({
              index: 0,
              routes: [{ name: 'FeedTab', params: { screen: 'FeedHome' } }], // ✅ HomeStack 내부 첫 화면 지정
            });
          },
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
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // 기본 동작 막기
            navigation.reset({
              index: 0,
              routes: [{ name: 'Chat', params: { screen: 'RoomList' } }], // ✅ HomeStack 내부 첫 화면 지정
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
            e.preventDefault(); // 기본 동작 막기
            navigation.reset({
              index: 0,
              routes: [{ name: 'MyPage', params: { screen: 'MyPageHome' } }], // ✅ HomeStack 내부 첫 화면 지정
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

function FeedNavigator() {
  const navigation = useNavigation();
  const { animateTabBar } = useTabBarAnimation();

  React.useEffect(() => {
    const onStateChange = () => {
      const state = navigation.getState();
      const activeTab = state?.routes[state.index]; // 현재 활성화된 탭
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
    <FeedStack.Navigator screenOptions={{ headerShown: false }}>
      <FeedStack.Screen name="FeedHome" component={SuspendedHomeScreen} />
      <FeedStack.Screen name="FeedSearch" component={FeedSearchScreen} />
      <FeedStack.Screen name="FeedWrite" component={FeedWriteScreen} />
      <FeedStack.Screen name="FeedDetail" component={SuspendedFeedDetailScreen} />
      <FeedStack.Screen name="CommentEdit" component={CommentEditScreen} />
    </FeedStack.Navigator>
  );
}

function VerificationNavigator() {
  return (
    <VerificationStack.Navigator screenOptions={{ headerShown: false }}>
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

  React.useEffect(() => {
    const onStateChange = () => {
      const state = navigation.getState();
      const activeTab = state?.routes[state.index]; // 현재 활성화된 탭
      const activeScreen = activeTab?.state?.routes?.[activeTab.state.index as any]?.name;
      const visible = activeScreen === 'RoomList' || activeScreen === undefined;
      navigation.setOptions({
        tabBarStyle: animateTabBar(!!visible),
      });
    };

    const unsubscribe = navigation.addListener('state', onStateChange);

    return unsubscribe;
  }, []);

  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="RoomList" component={SuspendedRoomListScreen} />
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
      const activeTab = state?.routes[state.index]; // 현재 활성화된 탭
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
    <MyPageStack.Navigator screenOptions={{ headerShown: false }}>
      <MyPageStack.Screen name="MyPageHome" component={MyPageScreen} />
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
  // TODO: 타입 수정 필요..
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    }
  }, [isAuthenticated]);

  useNotification();

  // 클라이언트에서 테스트 용도로 만든 함수
  // async function sendTestNotification() {
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: '📢 테스트 알림',
  //       body: '이것은 포그라운드에서 보내는 알림입니다!',
  //       data: { type: 'FEED', feedId: 1 },
  //     },
  //     trigger: null, // 즉시 실행
  //   });
  // }

  // sendTestNotification();

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        <Stack.Screen name="Verification" component={VerificationNavigator} />
        <Stack.Screen name="Tab" component={TabNavigator} />
      </Stack.Navigator>

      {/* 같은 형상을 공유하는 모달의 경우 상단으로 끌어올림. Tab으로 이동해도 될 듯 */}
      <StudentCertificationModal
        visible={modalVisible}
        onClose={() => handleModalClose('studentCertification')}
      />
    </>
  );
}
