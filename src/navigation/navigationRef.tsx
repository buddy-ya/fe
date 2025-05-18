import { Feed, Room } from '@/types';
import { createNavigationContainerRef } from '@react-navigation/native';

export type RootStackParamList = {
  Onboarding: undefined;
  Verification: undefined;
  Tab: undefined;
};

export type OnboardingStackParamList = {
  OnboardingWelcome: undefined;
  OnboardingPhone: undefined;
  OnboardingPhoneVerification: {
    phone: string;
  };
  OnboardingNotification:
    | {
        isExistingMember: boolean;
      }
    | undefined;
  OnboardingName: undefined;
  OnboardingGenderSelect: undefined;
  OnboardingUniversitySelect: undefined;
  OnboardingCountrySelect: undefined;
  OnboardingLanguageSelect: undefined;
  OnboardingMajorSelect: undefined;
  OnboardingInterestSelect: undefined;
  UniversitySelect: undefined;
  Tab: undefined;
  OnboardingStudentInfo: undefined;
  OnboardingStudentTypeSelect: undefined;
  OnboardingUserGuide: undefined;
};

export type FeedStackParamList = {
  FeedHome: undefined;
  FeedSearch: undefined;
  FeedWrite: { feed?: Feed; isEdit?: boolean; initialCategoryId?: string } | undefined;
  FeedDetail: {
    feedId: number;
    feedCategory?: string;
    source?: 'bookmark' | 'myPosts' | 'search';
    searchKeyword?: string;
  };
  CommentEdit: { feedId: number; commentId: number; initialContent: string };
  Profile: {
    id: number;
    showMatchingProfile: boolean;
    forceNotMyProfile?: boolean;
    characterImageUrl?: string;
  };
  EmailVerification: undefined;
  EmailVerificationCode: { email: string };
  EmailComplete: {
    pointChange?: number;
    currentPoint?: number;
  };
  StudentIdVerification: undefined;
  StudentIdComplete: undefined;
  Mission: undefined;
  GlobalBuddyPage: undefined;
};

export type VerificationStackParamList = {
  VerificationSelect: undefined;
  EmailVerification: undefined;
  EmailVerificationCode: { email: string };
  EmailComplete: {
    pointChange?: number;
    currentPoint?: number;
  };
  StudentIdVerification: undefined;
  StudentIdComplete: undefined;
};

export type MatchstackParamList = {
  MatchHome: undefined;
  Point: undefined;
  Mission: undefined;
  MyProfile: { id?: string; incompleteProfile?: boolean } | undefined;
  EditProfileImage: undefined;
  EditName: { isEditMode: boolean; initialName: string };
  EditLanguage: { isEditMode: boolean; initialLanguages: string[] };
  EditInterest: { isEditMode: boolean; initialInterests: string[] };
};

export type ChatStackParamList = {
  RoomList: undefined;
  ChatRoom: { id: number };
  ChatRequests: undefined;
  Profile: { id: number; showMatchingProfile: boolean };
};

export type MyPageStackParamList = {
  MyPageHome: undefined;
  MyProfile: { id?: string; incompleteProfile?: boolean } | undefined;
  EditProfileImage: undefined;
  EditName: { isEditMode: boolean; initialName: string };
  EditLanguage: { isEditMode: boolean; initialLanguages: string[] };
  EditInterest: { isEditMode: boolean; initialInterests: string[] };
  Bookmark: undefined;
  MyPosts: undefined;
  Settings: undefined;
  Point: undefined;
  FeedDetail: {
    feedId: number;
    feedCategory?: string;
    source?: 'bookmark' | 'myPosts' | 'search';
    searchKeyword?: string;
  };
  Onboarding: undefined;
  InvitationEvent: undefined;
  PointCoupon: undefined;
};
