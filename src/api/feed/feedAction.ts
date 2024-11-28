import { Platform } from "react-native";
import { apiClient } from "../apiClient";

interface FeedData {
  title: string;
  content: string;
  category: string;
  images: ImageFile[];
}

interface ImageFile {
  uri: string;
  type: string;
  fileName?: string;
}

const processImageForUpload = (image: ImageFile) => {
  const uri =
    Platform.OS === "ios" ? image.uri.replace("file://", "") : image.uri;
  return {
    uri,
    name: image.fileName || image.uri.split("/").pop(),
    type: image.type || `image/${image.uri.split(".").pop()}`,
  } as any; // FormData에 추가할 때 필요한 타입 캐스팅
};

export const createFeed = async ({
  title,
  content,
  category,
  images,
}: FeedData) => {
  const formData = new FormData();
  formData.append("title", title.trim());
  formData.append("content", content.trim());
  formData.append("category", category);

  if (images.length > 0) {
    images.forEach((image) => {
      formData.append("images", processImageForUpload(image));
    });
  } else {
    formData.append("images", JSON.stringify([]));
  }

  return await apiClient.post("/feeds", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateFeed = async (
  feedId: number,
  { title, content, category, images }: FeedData
) => {
  const formData = new FormData();
  formData.append("title", title.trim());
  formData.append("content", content.trim());
  formData.append("category", category);

  if (images.length > 0) {
    images.forEach((image) => {
      formData.append("images", processImageForUpload(image));
    });
  } else {
    formData.append("images", JSON.stringify([]));
  }

  return await apiClient.put(`/feeds/${feedId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteFeed = async (feedId: number) => {
  return await apiClient.delete(`/feeds/${feedId}`);
};
