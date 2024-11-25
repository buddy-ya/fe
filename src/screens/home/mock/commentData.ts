import { CommentType } from "../types";

export const mockComments: CommentType[] = [
  {
    id: 1,
    content: "와 대박 ㅋㅋ 나도 학교 고양이 좋아하는데!",
    name: "CatLover",
    country: "ko",
    createdDate: "2024-11-25T03:41:00",
    university: "세종대학교",
    isFeedOwner: false,
    isCommentOwner: true,
  },
  {
    id: 2,
    content: "우리 학교 근처에도 있어요",
    name: "CatLove",
    country: "us",
    university: "세종대학교",
    createdDate: "2024-03-24T10:45:00",
    isFeedOwner: true,
    isCommentOwner: false,
  },
  {
    id: 3,
    content: "귀엽다 ㅎㅎ",
    name: "DogLover",
    country: "jp",
    createdDate: "2024-03-24T11:00:00",
    university: "세종대학교",
    isFeedOwner: false,
    isCommentOwner: false,
  },
];
