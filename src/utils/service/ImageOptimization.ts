import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const PADDING = 32;
const GAP = 8;

export interface ImageDimensions {
  width: number;
  height: number;
}

export const IMAGE_CONFIG = {
  single: {
    width: screenWidth - PADDING,
    maxHeight: 500,
  },
  multiple: {
    width: (screenWidth - PADDING - GAP) / 2,
    maxHeight: 400,
  },
  detail: {
    width: screenWidth - PADDING,
    maxHeight: 600,
  },
} as const;

export const calculateImageHeight = (
  originalWidth: number,
  originalHeight: number,
  containerWidth: number,
  maxHeight: number
): number => {
  const scaledHeight = (containerWidth / originalWidth) * originalHeight;
  return Math.min(scaledHeight, maxHeight);
};
