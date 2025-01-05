import { NavigationProp } from '@react-navigation/native';
import { TFunction } from 'i18next';

export interface ModalTexts {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
}

interface ModalTextsParams {
  isKorean: boolean;
  isStudentIdCardRequested: boolean;
  t: TFunction;
  navigation: NavigationProp<any>;
}

export const getModalTexts = ({
  isKorean,
  isStudentIdCardRequested,
  t,
  navigation,
}: ModalTextsParams): ModalTexts => {
  if (isStudentIdCardRequested) {
    return {
      title: t('banner.pending.title'),
      description: t('banner.pending.description'),
      confirmText: t('banner.pending.confirm'),
      cancelText: t('banner.pending.cancel'),
      onConfirm: () => navigation.navigate('StudentIdComplete'),
    };
  }

  return {
    title: t('banner.default.title'),
    description: t('banner.default.description'),
    confirmText: t('banner.default.confirm'),
    cancelText: t('banner.default.cancel'),
    onConfirm: () => navigation.navigate(isKorean ? 'EmailVerification' : 'StudentIdVerification'),
  };
};
