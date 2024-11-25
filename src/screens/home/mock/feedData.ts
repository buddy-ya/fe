import { FeedResponse } from "../types";

export const mockFeeds: FeedResponse = {
  currentPage: 1,
  totalPages: 3,
  hasNext: true,
  feeds: [
    {
      id: 1,
      name: "CatLove",
      university: "세종대학교",
      country: "us",
      title: "학냥이 너무 귀여운 것 같아",
      content:
        "잘 찍었지? 학냥이가 너무너무 좋아. 잔디밭에서 뒹구는 것 봐 ㅎㅎㅎ",
      imageUrls: [
        "/api/placeholder/400/400", // 실제 이미지 URL 대신 placeholder 사용
        "/api/placeholder/400/400",
      ],
      likeCount: 6,
      commentCount: 2,
      isFeedOwner: false,
      isLiked: false,
      isBookmarked: false,
      createdDate: "2024-03-24T09:41:00",
    },
    {
      id: 2,
      name: "CatLove",
      university: "세종대학교",
      country: "us",
      title: "글글글 글글 글글 글",
      content: "맥주랑 크키카칵\n카스다카스다 어쩌고 ...",
      imageUrls: [],
      likeCount: 4,
      commentCount: 1,
      isFeedOwner: false,
      isLiked: true,
      isBookmarked: true,
      createdDate: "2024-03-24T09:41:00",
    },
    {
      id: 3,
      name: "교환학생",
      university: "University of Manchester",
      country: "uk",
      title: "영국 맨체스터 대학교 교환학생 후기",
      content:
        "안녕하세요! 저는 이번에 맨체스터 대학교에서 한 학기를 보내고 왔습니다. 정말 값진 경험이었어요...",
      imageUrls: [
        "/api/placeholder/400/400",
        "/api/placeholder/400/400",
        "/api/placeholder/400/400",
      ],
      likeCount: 42,
      commentCount: 5,
      isFeedOwner: false,
      isLiked: false,
      isBookmarked: false,
      createdDate: "2024-03-24T08:30:00",
    },
  ],
};
