import { ModalOption } from "@/screens/home/types";
import { Pencil, Trash2, Flag, X, PencilIcon } from "lucide-react-native";
import React from "react";

export const createModalOptions = {
  edit: (onPress: () => void): ModalOption => ({
    label: "수정하기",
    icon: <Pencil size={20} color="#282828" />,
    onPress,
  }),

  delete: (onPress: () => void): ModalOption => ({
    label: "삭제하기",
    icon: <Trash2 size={20} color="#282828" />,
    onPress,
  }),

  report: (onPress: () => void): ModalOption => ({
    label: "신고하기",
    icon: <Flag size={20} />,
    color: "text-red-500",
    onPress,
  }),

  cancel: (onPress: () => void): ModalOption => ({
    label: "취소",
    icon: <X size={20} color="#282828" />,
    onPress,
  }),
};
