import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Tab: {
        screens: {
          FeedTab: {
            initialRouteName: 'FeedHome',
            screens: {
              Feed: 'feeds',
              FeedDetail: 'feeds/:feedId',
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
