import { ImageFile } from "@/screens/home/types";
import { Platform } from "react-native";

export const processImageForUpload = (image: ImageFile) => {
  const uri = image.uri;
  return {
    uri,
    name: image.fileName || "image.jpg",
    type: image.type || "image/jpeg",
  } as any;
};
