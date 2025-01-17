import { Feed, Room } from "@/model";
import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export const resetToOnboarding = () => {
    if (navigationRef.isReady()) {
        navigationRef.reset({
            index: 0,
            routes: [{ name: 'Onboarding' }],
        });
    }
};

export type OnboardingStackParamList = {
    OnboardingWelcome: undefined;
    OnboardingPhone: undefined;
    OnboardingPhoneVerification: undefined;
    OnboardingNotification: {
        isExistingMember: boolean
    } | undefined;
    OnboardingStudentInfo: undefined;
    OnboardingUniversitySelect: undefined;
    OnboardingStudentTypeSelect: undefined;
    OnboardingGenderSelect: undefined;
    OnboardingName: { mode: string };
    OnboardingCountrySelect: undefined;
    OnboardingLanguageSelect: undefined;
    OnboardingMajorSelect: undefined;
    OnboardingInterestSelect: undefined;
};

export type FeedStackParamList = {
    FeedHome: undefined; // 파라미터 없음
    FeedSearch: undefined;
    FeedWrite: { feed: Feed, isEdit: boolean } | undefined;
    FeedDetail: { feedId: number };
    CommentEdit: { feedId: number, commentId: number, initialContent: string };
    EmailVerification: undefined;
    EmailVerificationCode: { email: string };
    EmailComplete: undefined;
    StudentIdVerification: undefined;
    StudentIdComplete: undefined;
};

export type ChatStackParamList = {
    RoomList: undefined; // 파라미터 없음
    ChatRoom: Room; // roomId를 파라미터로 받음
};

// MyPageStack Param List 정의
export type MyPageStackParamList = {
    MyPageHome: undefined;
    MyProfile: undefined;
    EditProfileImage: undefined;
    EditName: { mode: string, initialName: string };
    EditLanguage: { mode: string, initialLanguages: string[] };
    EditInterest: { mode: string, initialInterests: string[] };
    Bookmark: undefined;
    MyPosts: undefined;
    FeedDetail: { feedId: number };
};

