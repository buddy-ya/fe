import { ModalOption } from '@/screens/home/types';
import i18next from 'i18next';
import { Flag, Pencil, Trash2, X } from 'lucide-react-native';
import React from 'react';

export const createModalOptions = {
  edit: (onPress: () => void): ModalOption => ({
    label: i18next.t('feed:modal.edit'),
    icon: <Pencil size={20} color="#282828" />,
    onPress,
  }),

  delete: (onPress: () => void): ModalOption => ({
    label: i18next.t('feed:modal.delete'),
    icon: <Trash2 size={20} color="#282828" />,
    onPress,
  }),

  report: (onPress: () => void): ModalOption => ({
    label: i18next.t('feed:modal.report'),
    icon: <Flag size={20} color="#282828" />,
    onPress,
  }),

  cancel: (onPress: () => void): ModalOption => ({
    label: i18next.t('feed:modal.cancel'),
    icon: <X size={20} color="#282828" />,
    onPress,
  }),
};
