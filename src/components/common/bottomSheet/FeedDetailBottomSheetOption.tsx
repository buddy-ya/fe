import { ModalOption } from '@/screens/home/types';
import i18next from 'i18next';
import { Flag, Pencil, Trash2 } from 'lucide-react-native';

export const bottomSheetOptions = {
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
};
