import { ImageFile } from "@/screens/home/types";

export const processImageForUpload = (image: ImageFile) => {
  const uri = image.uri;
  return {
    uri,
    name: image.fileName || "image.jpg",
    type: image.type || "image/jpeg",
  } as any;
};
