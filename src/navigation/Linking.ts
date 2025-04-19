import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Verification: {
        path: 'verification',
        initialRouteName: 'VerificationSelect',
        screens: {
          VerificationSelect: '',
          EmailVerification: 'email',
          EmailVerificationCode: 'email-code',
          EmailComplete: 'email-complete',
          StudentIdVerification: 'studentIdCard',
          StudentIdComplete: 'studentIdCardComplete',
        },
      },
      Tab: {
        screens: {
          FeedTab: {
            initialRouteName: 'FeedHome',
            screens: {
              FeedHome: 'home',
              Feed: 'feeds',
              FeedDetail: 'feeds/:feedId',
            },
          },
          Match: {
            initialRouteName: 'MatchHome',
            screens: {
              MatchHome: 'match',
            },
          },
          Chat: {
            initialRouteName: 'RoomList',
            screens: {
              ChatRequests: 'chatRequests',
              ChatRoom: 'chats/:id',
            },
          },
          MyPage: {
            initialRouteName: 'MyPageHome',
            screens: {
              MyPageHome: 'my',
              Point: 'point',
            },
          },
        },
      },
    },
  },
};
