import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Verification: {
        initialRouteName: 'VerificationSelect',
        screens: {
          StudentIdVerification: 'studentIdCard',
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
        },
      },
    },
  },
};
