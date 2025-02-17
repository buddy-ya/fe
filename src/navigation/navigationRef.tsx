import { Feed, Room } from '@/types';

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
  OnboardingStudentInfo: undefined;
  OnboardingUniversitySelect: undefined;
  OnboardingStudentTypeSelect: undefined;
  OnboardingGenderSelect: undefined;
  OnboardingName: undefined;
  OnboardingCountrySelect: undefined;
  OnboardingLanguageSelect: undefined;
  OnboardingMajorSelect: undefined;
  OnboardingInterestSelect: undefined;
  UniversitySelect: undefined;
  Tab: undefined;
};

export type FeedStackParamList = {
  FeedHome: undefined; // 파라미터 없음
  FeedSearch: undefined;
  FeedWrite: { feed: Feed; isEdit: boolean } | undefined;
  FeedDetail: { feedId: number };
  CommentEdit: { feedId: number; commentId: number; initialContent: string };
  EmailVerification: undefined;
  EmailVerificationCode: { email: string };
  EmailComplete: undefined;
  StudentIdVerification: undefined;
  StudentIdComplete: undefined;
};

export type VerificationStackParamList = {
  VerificationSelect: undefined;
  EmailVerification: undefined;
  EmailVerificationCode: { email: string };
  EmailComplete: undefined;
  StudentIdVerification: undefined;
  StudentIdComplete: undefined;
};

export type ChatStackParamList = {
  RoomList: undefined; // 파라미터 없음
  ChatRoom: { id: number }; // roomId를 파라미터로 받음
  ChatRequests: undefined;
  Profile: { id: number };
};

// MyPageStack Param List 정의
export type MyPageStackParamList = {
  MyPageHome: undefined;
  MyProfile: undefined;
  EditProfileImage: undefined;
  EditName: { isEditMode: boolean; initialName: string };
  EditLanguage: { isEditMode: boolean; initialLanguages: string[] };
  EditInterest: { isEditMode: boolean; initialInterests: string[] };
  Bookmark: undefined;
  MyPosts: undefined;
  Settings: undefined;
  FeedDetail: { feedId: number };
};
