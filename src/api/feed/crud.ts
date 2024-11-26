import { Platform } from "react-native";
import { apiClient } from "../apiClient";

export const createFeed = async (title, content, category, images) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("category", category);

  if (images.length > 0) {
    images.forEach((image) => {
      formData.append("images[]", {
        uri:
          Platform.OS === "android"
            ? image.uri
            : image.uri.replace("file://", ""),
        type: image.type || "image/jpeg",
        name: image.fileName || `image.${image.type.split("/")[1]}`,
      } as any);
    });
  } else {
    formData.append("images", JSON.stringify([]));
  }
  console.log(formData);
  return await apiClient.post("/feeds", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateFeed = async (
  feedId: number,
  data: {
    title: string;
    content: string;
    category: string;
    images: File[];
  }
) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("category", data.category);

  data.images.forEach((image) => {
    formData.append("images", image);
  });

  return await apiClient.put(`/feeds/${feedId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteFeed = async (feedId: number) => {
  return await apiClient.delete(`/feeds/${feedId}`);
};
