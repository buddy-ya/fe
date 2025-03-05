import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Tab: {
        screens: {
          FeedTab: {
            screens: {
              Feed: 'feeds',
              FeedDetail: 'feeds/:feedId',
            },
          },
          Chat: {
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
