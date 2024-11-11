// navigation/router.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import WelcomeScreen from "../screens/onboarding/WelcomeScreen";
import SplashScreen from "@/screens/SplashScreen";
import HomeScreen from "@screens/home/HomeScreen";
import MatchingScreen from "@screens/matching/MatchingScreen";
import ChatScreen from "@screens/chat/ChatScreen";
import FeedScreen from "@screens/feed/FeedScreen";
import MyPageScreen from "@screens/mypage/MyPageScreen";
import PhoneScreen from "@/screens/onboarding/PhoneScreen";
import PhoneVerificationScreen from "@/screens/onboarding/PhoneVerificationScreen";
import NotificationScreen from "@/screens/onboarding/NotificationScreen";
import StudentInfo from "@/screens/onboarding/StudentInfoScreen";
import UniversitySelectScreen from "@/screens/onboarding/UniversitySelectScreen";
import StudentTypeSelectScreen from "@/screens/onboarding/StudentTypeSelectScreen";
import GenderSelectScreen from "@/screens/onboarding/GenderSelectScreen";
import NameScreen from "@/screens/onboarding/NameScreen";
import LanguageSelectScreen from "@/screens/onboarding/LanguageSelectScreen";
import MajorSelectScreen from "@/screens/onboarding/MajorSelectScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const OnboardingStack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Matching" component={MatchingScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="MyPage" component={MyPageScreen} />
    </Tab.Navigator>
  );
}

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen
        name="OnboardingWelcome"
        component={WelcomeScreen}
      />
      <OnboardingStack.Screen name="OnboardingPhone" component={PhoneScreen} />
      <OnboardingStack.Screen
        name="OnboardingPhoneVerification"
        component={PhoneVerificationScreen}
      />
      <OnboardingStack.Screen
        name="OnboardingNotification"
        component={NotificationScreen}
      />
      <OnboardingStack.Screen
        name="OnboardingStudentInfo"
        component={StudentInfo}
      />
      <OnboardingStack.Screen
        name="OnboardingUniversitySelect"
        component={UniversitySelectScreen}
      />
      <OnboardingStack.Screen
        name="OnboardingStudentTypeSelect"
        component={StudentTypeSelectScreen}
      />
      <OnboardingStack.Screen
        name="OnboardingGenderSelect"
        component={GenderSelectScreen}
      />
      <OnboardingStack.Screen name="OnboardingName" component={NameScreen} />
      <OnboardingStack.Screen
        name="OnboardingLanguageSelect"
        component={LanguageSelectScreen}
      />
      <OnboardingStack.Screen
        name="OnboardingMajorSelect"
        component={MajorSelectScreen}
      />
    </OnboardingStack.Navigator>
  );
}

export default function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
