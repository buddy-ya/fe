import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.createURL('/')], // 🔥 앱의 URL 스키마
  config: {
    screens: {
      Tab: {
        // ✅ `Stack.Screen name="Tab"`
        screens: {
          FeedTab: {
            // ✅ `Tab.Screen name="FeedTab"` (탭 네비게이션 안에 있는 탭)
            screens: {
              Feed: 'feeds',
              FeedDetail: 'feeds/:feedId', // ✅ 특정 피드 상세 (myapp://feeds/:feedId)
            },
          },
        },
      },
    },
  },
};
